import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

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

    const cards = await geminiService.generateFlashcards(document.extractedtext || '', parseInt(count, 10));

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

    const questions = await geminiService.generateQuiz(document.extractedtext || '', parseInt(numQuestions, 10));

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title}-Quiz`,
      questions,
      totalQuestions: questions.length,
      userAnswer: [],
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

    const summary = await geminiService.generateSummary(document.extractedtext || '');

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

    const chunks = await findRelevantChunks(document.chunks || [], question, 3);
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

    const answer = await geminiService.chatWithContext(question, chunks);

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

    const relevantChunks = await findRelevantChunks(document.chunks || [], concept, 3);
    const context = relevantChunks.map(c => c.content).join('\n\n');

    const explanation = await geminiService.explainConcept(concept, context);

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