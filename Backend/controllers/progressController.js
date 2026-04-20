import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/Flashcard.js";

export const getDashboard = async(req, res, next)=>{
    try{
         const userId = req.user._id;

         const [
            totalDocuments,
            totalFlashcardSets,
            totalQuizzes,
            completedQuizzes,
            flashcardStatsAgg,
            quizAverageAgg,
            recentDocuments,
            recentQuizzes
         ] = await Promise.all([
            Document.countDocuments({ userId }),
            Flashcard.countDocuments({ userId }),
            Quiz.countDocuments({ userId }),
            Quiz.countDocuments({ userId, completedAt: { $ne: null } }),
            Flashcard.aggregate([
              { $match: { userId } },
              {
                $project: {
                  totalCards: { $size: { $ifNull: ["$cards", []] } },
                  reviewedCards: {
                    $size: {
                      $filter: {
                        input: "$cards",
                        as: "card",
                        cond: { $gt: ["$$card.reviewCount", 0] }
                      }
                    }
                  },
                  starredCards: {
                    $size: {
                      $filter: {
                        input: "$cards",
                        as: "card",
                        cond: { $eq: ["$$card.isStarred", true] }
                      }
                    }
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  totalFlashcards: { $sum: "$totalCards" },
                  reviewedFlashcards: { $sum: "$reviewedCards" },
                  starredFlashcards: { $sum: "$starredCards" }
                }
              }
            ]),
            Quiz.aggregate([
              { $match: { userId, completedAt: { $ne: null } } },
              {
                $group: {
                  _id: null,
                  averageScore: { $avg: "$score" }
                }
              }
            ]),
            Document.find({ userId })
              .sort({ lastAccessed: -1 })
              .limit(5)
              .select("title fileName lastAccessed status")
              .lean(),
            Quiz.find({ userId })
              .sort({ completedAt: -1, createdAt: -1 })
              .limit(5)
              .populate("documentId", "title")
              .select("title score totalQuestions completedAt")
              .lean()
         ]);

            const flashcardStats = flashcardStatsAgg[0] || {};
            const totalFlashcards = flashcardStats.totalFlashcards || 0;
            const reviewedFlashcards = flashcardStats.reviewedFlashcards || 0;
            const starredFlashcards = flashcardStats.starredFlashcards || 0;
            const averageScore = quizAverageAgg[0]?.averageScore
              ? Math.round(quizAverageAgg[0].averageScore)
              : 0;

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
        next(error);
    }
}
