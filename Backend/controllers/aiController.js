import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import AiActionHistory from "../models/AiActionHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText, findRelevantChunks } from "../utils/textChunker.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const documentsDir = path.join(__dirname, "../uploads/documents");

const normalizeText = (text = "") =>
  text
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasMeaningfulExtractedText = (text = "") => {
  const normalized = normalizeText(text);
  return normalized.length >= 120 && /[a-zA-Z]{3,}/.test(normalized);
};

const hasReadableExtractedText = (text = "") => {
  const normalized = normalizeText(text);
  return normalized.length >= 20 && /[a-zA-Z]{3,}/.test(normalized);
};

const createHttpError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getLocalDocumentPath = (document) => {
  let fileName;

  try {
    fileName = decodeURIComponent(path.basename(new URL(document.filePath).pathname));
  } catch {
    fileName = path.basename(document.filePath);
  }

  return path.join(documentsDir, fileName);
};

const getDocumentAiSource = async (document) => {
  let pdfPart = null;
  let extractedText = hasReadableExtractedText(document.extractedText) ? normalizeText(document.extractedText) : "";

  if (!extractedText) {
    const localPath = getLocalDocumentPath(document);

    try {
      const parsedPdf = await extractTextFromPDF(localPath);
      extractedText = hasReadableExtractedText(parsedPdf.text) ? normalizeText(parsedPdf.text) : "";

      if (extractedText) {
        document.extractedText = parsedPdf.text;
        document.chunks = chunkText(parsedPdf.text, 500, 50);
        document.status = "ready";
        await document.save();
      }
    } catch (error) {
      console.error(`Failed to re-parse PDF for document ${document._id}:`, error);
    }
  }

  const localPath = getLocalDocumentPath(document);
  const allowGeminiFileUpload = process.env.USE_GEMINI_FILE_UPLOAD === "true";

  if (allowGeminiFileUpload && !extractedText && document.aiFileUri && document.aiFileMimeType) {
    pdfPart = geminiService.createPartFromStoredUri?.(document.aiFileUri, document.aiFileMimeType);
  }

  if (allowGeminiFileUpload && !pdfPart && !extractedText) {
    const { file, part } = await geminiService.uploadPdfAndCreatePart(localPath, document.fileName);
    document.aiFileUri = file.uri || "";
    document.aiFileMimeType = file.mimeType || "application/pdf";
    document.aiFileName = file.name || "";
    await document.save();
    pdfPart = part;
  }

  if (!pdfPart && !extractedText) {
    pdfPart = await geminiService.createPartFromLocalPdf(localPath);
  }

  if (!pdfPart && !extractedText) {
    throw createHttpError(
      "This PDF does not contain enough readable text and could not be sent to Gemini for visual reading.",
      400
    );
  }

  return {
    pdfPart,
    text: extractedText,
  };
};

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
    }
console.log(documentId,req.user._id)
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      // status: 'ready'
    });

    if (!document) {
      console.log("document doesnt exist")
      return res.status(400).json({ success: false, error: 'Document not found or not ready', statusCode: 400 });
    }

    const aiSource = await getDocumentAiSource(document);
    const cards = await geminiService.generateFlashcards(aiSource, parseInt(count, 10));

    if (!cards.length) {
      return res.status(400).json({
        success: false,
        error: 'The uploaded PDF does not contain enough readable content to generate flashcards',
        statusCode: 400
      });
    }

    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || 'medium'
      }))
    });

    return res.status(201).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcards generated successfully'
    });
  } catch (error) {
    console.error('Error in generateFlashcards:', error);
    next(error);
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;
    const parsedQuestionCount = parseInt(numQuestions, 10);
    const normalizedQuestionCount = Math.min(
      10,
      Math.max(1, Number.isNaN(parsedQuestionCount) ? 5 : parsedQuestionCount)
    );

    if (!documentId) {
      return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      // status: 'ready'
    });

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
    }

    const aiSource = await getDocumentAiSource(document);
    const questions = await geminiService.generateQuiz(aiSource, normalizedQuestionCount);

    if (!questions.length) {
      return res.status(400).json({
        success: false,
        error: 'The uploaded PDF does not contain enough readable content to generate a quiz',
        statusCode: 400
      });
    }

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title}-Quiz`,
      questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    return res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz generated successfully'
    });
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
    }

    const aiSource = await getDocumentAiSource(document);
    const summary = await geminiService.generateSummary(aiSource);
    await AiActionHistory.create({
      userId: req.user._id,
      documentId: document._id,
      type: "summary",
      title: "Generated Summary",
      content: summary,
    });

    return res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });
  } catch (error) {
    console.error('Error in generateSummary:', error);
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Document ID and question are required', statusCode: 400 });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
    }

    const aiSource = await getDocumentAiSource(document);
    const chunks = hasReadableExtractedText(document.extractedText)
      ? await findRelevantChunks(document.chunks || [], question, 3)
      : [];
    const chunkIndices = chunks.map(c => c.chunkIndex);

    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
      });
    }

    const answer = await geminiService.chatWithContext(question, chunks, aiSource);

    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    return res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: 'Response generated successfully'
    });
  } catch (error) {
    console.error('Error in chat:', error);
    next(error);
  }
};

export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept || !concept.trim()) {
      return res.status(400).json({ success: false, error: 'Document ID and concept are required', statusCode: 400 });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found or not ready', statusCode: 404 });
    }

    const aiSource = await getDocumentAiSource(document);
    const relevantChunks = hasReadableExtractedText(document.extractedText)
      ? await findRelevantChunks(document.chunks || [], concept, 3)
      : [];
    const context = relevantChunks.map(c => c.content).join('\n\n');

    const explanation = await geminiService.explainConcept(concept, context, aiSource);
    await AiActionHistory.create({
      userId: req.user._id,
      documentId: document._id,
      type: "explanation",
      title: `Explanation of "${concept.trim()}"`,
      prompt: concept.trim(),
      content: explanation,
    });

    return res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Response generated successfully'
    });
  } catch (error) {
    console.error('Error in explainConcept:', error);
    next(error);
  }
};

export const getActionHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
    }

    const history = await AiActionHistory.find({
      userId: req.user._id,
      documentId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      data: history,
      message: 'AI action history retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getActionHistory:', error);
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId
    }).select('messages');

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No chat history found for this document'
      });
    }

    return res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: 'Chat history retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    next(error);
  }
};
