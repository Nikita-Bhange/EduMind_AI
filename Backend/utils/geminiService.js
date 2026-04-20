import dotenv from 'dotenv';
import { GoogleGenAI, createPartFromUri } from '@google/genai';

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
    console.error('Gemini file upload error:', error);
    throw new Error('Failed to upload PDF to Gemini');
  }
};

export const createPartFromStoredUri = (uri, mimeType = 'application/pdf') =>
  createPartFromUri(uri, mimeType);

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (source, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards strictly from the attached document.
Do not use outside knowledge.
If the document does not contain enough readable content, return exactly:
INSUFFICIENT_CONTENT

Format each flashcard as:
Q: [Clear, specific question]
A: [Concise, accurate answer]
D: [Difficulty level: easy, medium, or hard]

Separate each flashcard with "---"
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

    // Parse the response
    const flashcards = [];
    const cards = generatedText.split('---').filter(c => c.trim());

    for (const card of cards) {
      const lines = card.trim().split('\n');
      let question = '', answer = '', difficulty = 'medium';

      for (const line of lines) {
        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          answer = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

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
  const prompt = `Generate exactly ${numQuestions} multiple choice questions strictly from the attached document.
Do not use outside knowledge.
If the document does not contain enough readable content, return exactly:
INSUFFICIENT_CONTENT

Format each question as:

Q: [Question]
O1: [Option 1]
O2: [Option 2]
O3: [Option 3]
O4: [Option 4]
C: [Correct option - exactly as written above]
E: [Brief explanation]
D: [Difficulty: easy, medium, or hard]

Separate questions with "---"
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

    const questions = [];
    const questionBlocks = generatedText.split('---').filter(q => q.trim());

    for (const block of questionBlocks) {
      const lines = block.trim().split('\n');

      let question = '';
      let options = [];
      let correctAnswer = '';
      let explanation = '';
      let difficulty = 'medium';

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith('Q:')) {
          question = trimmed.substring(2).trim();
        } else if (trimmed.match(/^O\d:/)) {
          options.push(trimmed.substring(3).trim());
        } else if (trimmed.startsWith('C:')) {
          correctAnswer = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('E:')) {
          explanation = trimmed.substring(2).trim();
        } else if (trimmed.startsWith('D:')) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty
        });
      }
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate quiz');
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
