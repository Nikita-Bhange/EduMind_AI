import Document from "../models/Document";
import { generateFlashcards } from "../utils/geminiService.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";

export const getDashboard = async(req, resizeBy,next)=>{
    try{
         const  userId = req.user._id

         //get counts
         const totalDocuments = await Document.countDocuments({userId});
          const totalFlashcardSets = await Flashcard.countDocuments({userId});
           const totalQuizzs = await Quiz.countDocuments({userId});
            const completedQuizzes = await Quiz.countDocuments({userId,completed:{$ne: null}});

            //Get flashcard statistics
            const flashcardSets = await Flashcard.find({userId});
            let totalFlashcards = 0;
            let reviewedFlashcards =0;

            flashcardSets.forEach(set=>{
                totalFlashcards += set.cards.filter(c=>c.reviewCount >0).length
                reviewedFlashcards += set.cards.filter(c=>c.isStarred).length
                starredFlashcards += set.cards.filter(c=>c.isStarred).length
            })

            //get quiz statistcs

            // Get quiz statistics
const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
const averageScore = quizzes.length > 0
  ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
  : 0;

// Recent activity
const recentDocuments = await Document.find({ userId })
  .sort({ lastAccessed: -1 })
  .limit(5)
  .select('title fileName lastAccessed status');

const recentQuizzes = await Quiz.find({ userId })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('documentId', 'title')
  .select('title score totalQuestions completedAt');

// Study streak (simplified - in production, track daily activity)
const studyStreak = Math.floor(Math.random() * 7) + 1; // Mock

            res.status(200).json({
                success:true,
                data:{
                overview:{
                    totalDocuments,
                    totalFlashcardSets,
                    totalQuizzes,
                    completedQuizzes,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    averageScore,
                    recentDocuments,
                    recentQuizzes,
                    studyStreak
                },
                recentActivity:{
                   documents: recentDocuments,
                    quizzes:recentQuizzes
            }
        }
     });

    }catch(error){

    }
}