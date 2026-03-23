import express from 'express';
import {
    geQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
} from '../controllers/quizController.js';
import protect from '../middleware/auth.js'

const router = express.Router();

router.use(protect);

router.get('/:documentId',getquizzes);
router.get('/quiz/:id',getQuizById);
router.post('/:id/submit',submitQuiz);
router.get('/:id/results',getQuizResults);
router.delete('/:id',deleteQuiz)

export default router;