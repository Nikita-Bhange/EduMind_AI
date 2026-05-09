import React from "react";
import { Trash2, Award, BarChart2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  const questionCount = Array.isArray(quiz?.questions)
    ? quiz.questions.length
    : Number(quiz?.totalQuestions || 0);
  const hasQuestions = questionCount > 0;
  const hasResults = Array.isArray(quiz?.userAnswers) && quiz.userAnswers.length > 0;

  return (
    <div className="group relative bg-white/80 dark:bg-[#151515]/95 backdrop-blur-xl border-2 border-slate-200 dark:border-[#2f2f2f] hover:border-emerald-300 dark:hover:border-[#784BA0] rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-[#7A00FF]/20 flex-col justify-between p-4">

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="space-y-4">

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 py-1 rounded-lg text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-[#2a1830] border border-emerald-200 dark:border-[#784BA0]/50 px-3 py-1 rounded-lg">
            <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ff8bcb]" strokeWidth={2.5} />
            <span className="text-emerald-700 dark:text-[#ffb3dc]">
              Score: {quiz?.score}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3
            className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-2"
            title={quiz.title}
          >
            {quiz.title ||
              `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
          </h3>

          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Created {moment(quiz.createdAt).format("MMM D, YYYY")}
          </p>
        </div>

        {/* Quiz Info */}
              
                {questionCount > 0 && (
  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-[#2a2a2a]">
    <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#2f2f2f] rounded-lg">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {questionCount}{" "}
        {questionCount === 1 ? "Question" : "Questions"}
      </span>
    </div>
  </div>
)}

      </div>

      {/* Action Button */}
      <div className="mt-2 pt-4 border-t border-slate-100 dark:border-[#2a2a2a]">
        {hasResults ? (
          <Link to={`/quizzes/${quiz._id}/results`}>
            <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#1c1c1c] dark:hover:bg-[#242424] dark:text-slate-200 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ">
              <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
              View Results
            </button>
          </Link>
        ) : hasQuestions ? (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="group/btn relative w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-[#FF3CAC] dark:to-[#784BA0] dark:hover:from-[#ff57b8] dark:hover:to-[#8a57b2] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 dark:shadow-[#7A00FF]/30 active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" strokeWidth={2.5} />
                Start Quiz
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            </button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full h-11 bg-slate-100 dark:bg-[#1c1c1c] text-slate-400 font-semibold text-sm rounded-xl cursor-not-allowed"
          >
            Quiz Unavailable
          </button>
        )}
      </div>

    </div>
  );
};

export default QuizCard;
