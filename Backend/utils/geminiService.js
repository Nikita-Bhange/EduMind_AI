import dotenv from 'dotenv';
import fs from 'fs/promises';
import { GoogleGenAI, createPartFromBase64, createPartFromUri } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const normalizeSource = (source) => {
  if (typeof source === 'string') {
    return { text: source, pdfPart: null };
  }

  return {
    text: source?.text || '',
    pdfPart: source?.pdfPart || null,
  };
};

const buildContents = (prompt, source, textLimit = 15000) => {
  const { text, pdfPart } = normalizeSource(source);
  const contents = [prompt];

  if (pdfPart) {
    contents.push(pdfPart);
  }

  if (text.trim()) {
    contents.push(`Supplemental extracted text from the same PDF:\n${text.substring(0, textLimit)}`);
  }

  return contents;
};

const stripCodeFence = (text = '') =>
  text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();

const parseJsonArray = (text = '') => {
  const stripped = stripCodeFence(text);
  try {
    return JSON.parse(stripped);
  } catch {
    const match = stripped.match(/\[[\s\S]*\]/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const normalizeDifficulty = (difficulty = 'medium') => {
  const value = String(difficulty).toLowerCase();
  return ['easy', 'medium', 'hard'].includes(value) ? value : 'medium';
};

export const uploadPdfAndCreatePart = async (filePath, displayName = 'document.pdf') => {
  try {
    const uploadedFile = await ai.files.upload({
      file: filePath,
      config: {
        mimeType: 'application/pdf',
        displayName,
      },
    });

    return {
      file: uploadedFile,
      part: createPartFromUri(uploadedFile.uri, uploadedFile.mimeType || 'application/pdf'),
    };
  } catch (error) {
    const detail = error?.message || error?.statusText || 'Unknown Gemini upload error';
    console.error('Gemini file upload error:', detail, error);
    const uploadError = new Error(`Failed to upload PDF to Gemini: ${detail}`);

    if (
      detail.includes('PERMISSION_DENIED') ||
      detail.toLowerCase().includes('api key')
    ) {
      uploadError.statusCode = 502;
      uploadError.message = 'Gemini API key is invalid, expired, or not permitted. Please create a new Gemini API key and update Backend/.env.';
    }

    throw uploadError;
  }
};

export const createPartFromStoredUri = (uri, mimeType = 'application/pdf') =>
  createPartFromUri(uri, mimeType);

export const createPartFromLocalPdf = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);
  return createPartFromBase64(fileBuffer.toString('base64'), 'application/pdf');
};

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (source, count = 10) => {
  const candidateCount = Math.min(20, Math.max(count + 4, count));
  const prompt = `Generate ${candidateCount} high-quality educational flashcards strictly from the attached document, then return the best ${count}.
Do not use outside knowledge. Ignore file names, authors, creation dates, cover pages, page labels, and PDF metadata.
Prioritize medically/academically important ideas from the body content.
Cover distinct sections and topics across the document. If anatomy, biochemistry, and physiology are present, include all of them.
Avoid trivial questions like who created the PDF, what the title is, or how many pages it has.
Prefer moderate recall, comparison, relationship, function, and application questions.
If the document does not contain enough readable content, return exactly:
INSUFFICIENT_CONTENT

Return only valid JSON, no markdown:
[
  {"question":"Clear specific question","answer":"Concise accurate answer","difficulty":"medium"}
]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: buildContents(prompt, source),
    });

    const generatedText = response.text || '';

    if (generatedText.includes('INSUFFICIENT_CONTENT')) {
      return [];
    }

    const parsedCards = parseJsonArray(generatedText);
    const flashcards = Array.isArray(parsedCards)
      ? parsedCards
          .map((card) => ({
            question: String(card.question || '').trim(),
            answer: String(card.answer || '').trim(),
            difficulty: normalizeDifficulty(card.difficulty),
          }))
          .filter((card) => card.question && card.answer)
      : [];

    return flashcards.slice(0, count);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Generate quiz questions
 * @param {string} text - Document text
 * @param {number} numQuestions - Number of questions
 * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>}
 */
export const generateQuiz = async (source, numQuestions = 5) => {
  const candidateCount = Math.min(15, Math.max(numQuestions + 3, numQuestions));
  const prompt = `Generate ${candidateCount} multiple choice question candidates strictly from the attached document, then return the best ${numQuestions}.
Do not use outside knowledge. Ignore file names, authors, creation dates, cover pages, page labels, and PDF metadata.
Cover distinct sections and topics across the document. If anatomy, biochemistry, and physiology are present, include questions from all sections.
Target mostly medium difficulty. Avoid very easy definition-only questions unless needed for balance.
Prefer application, comparison, cause-effect, structure-function, and clinical/academic reasoning questions.
Each question must test actual body content from the document, not document properties.
If the document does not contain enough readable content, return exactly:
INSUFFICIENT_CONTENT

Return only valid JSON, no markdown:
[
  {
    "question":"Question text",
    "options":["Option A","Option B","Option C","Option D"],
    "correctAnswer":"Exact option text",
    "explanation":"Brief explanation grounded in the document",
    "difficulty":"medium"
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: buildContents(prompt, source),
    });

    const generatedText = response.text || '';

    if (generatedText.includes('INSUFFICIENT_CONTENT')) {
      return [];
    }

    const parsedQuestions = parseJsonArray(generatedText);
    const questions = Array.isArray(parsedQuestions)
      ? parsedQuestions
          .map((item) => {
            const options = Array.isArray(item.options)
              ? item.options.map((option) => String(option || '').trim()).filter(Boolean).slice(0, 4)
              : [];
            let correctAnswer = String(item.correctAnswer || '').trim();
            const optionIndexMatch = correctAnswer.match(/^O([1-4])$/i);
            if (optionIndexMatch) {
              correctAnswer = options[Number(optionIndexMatch[1]) - 1] || correctAnswer;
            }

            return {
              question: String(item.question || '').trim(),
              options,
              correctAnswer,
              explanation: String(item.explanation || '').trim(),
              difficulty: normalizeDifficulty(item.difficulty),
            };
          })
          .filter((item) => item.question && item.options.length === 4 && item.correctAnswer)
      : [];

    return questions.slice(0, numQuestions);
  } catch (error) {
    const detail = error?.message || 'Unknown Gemini quiz error';
    console.error('Gemini quiz error:', detail, error);
    const quizError = new Error(`Failed to generate quiz: ${detail}`);
    quizError.statusCode = error?.statusCode || error?.status || 500;
    throw quizError;
  }
};


/**
 * Generate document summary
 * @param {string} text - Document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (source) => {
  const prompt = `Summarize the attached document clearly and accurately.
Focus only on the document content.
If the document is unreadable or does not contain enough meaningful content, say that plainly.

Structure the response as:
1. Main topic
2. Key points
3. Important details or examples`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: buildContents(prompt, source, 20000),
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate summary');
  }
};


/**
 * Chat with document context
 * @param {string} question - User question
 * @param {Array<Object>} chunks - Relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks, source = null) => {
  const context = chunks
    .map((c, i) => `Chunk ${i + 1}:\n${c.content}`)
    .join("\n\n");

  const prompt = `Answer the user's question using only the attached document and any provided extracted context.
If the answer is not supported by the document, say so clearly.

Context:
${context}

Question: ${question}

Answer:`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: buildContents(prompt, source, 12000),
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to process chat request');
  }
};
/**
 * Explain a specific concept
 * @param {string} concept - Concept to explain
 * @param {string} context - Relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context, source = null) => {
  const prompt = `Explain the concept of "${concept}" using only the attached document and the provided context.
Provide a clear, educational explanation that's easy to understand.
Include examples if relevant.

Context:
${context.substring(0, 10000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: buildContents(prompt, source, 10000),
    });

    const generatedText = response.text;
    return generatedText;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to explain concept');
  }
};
