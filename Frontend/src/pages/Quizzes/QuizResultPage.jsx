import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [resultPayload, setResultPayload] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResultPayload(data.data || null);
      } catch (error) {
        toast.error(error.message || "Failed to fetch quiz results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return <Spinner />;
  }

  if (!resultPayload?.quiz || !Array.isArray(resultPayload.results)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600 text-lg">Quiz results not found.</p>
      </div>
    );
  }

  const { quiz, results } = resultPayload;
  const correctAnswers = results.filter((item) => item.isCorrect).length;
  const incorrectAnswers = results.length - correctAnswers;
  const documentId = quiz.document?._id || quiz.document;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link
          to={documentId ? `/documents/${documentId}` : "/documents"}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || "Quiz"} Results`} />

      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex gap-4 flex-wrap">
          <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">Score</div>
            <div className="text-2xl font-semibold text-slate-900">{quiz.score}%</div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-xs text-emerald-600">Correct</div>
            <div className="text-2xl font-semibold text-emerald-700">{correctAnswers}</div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-xs text-rose-600">Incorrect</div>
            <div className="text-2xl font-semibold text-rose-700">{incorrectAnswers}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((item, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-2">Question {index + 1}</div>
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
              </div>
              {item.isCorrect ? (
                <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />
              ) : (
                <XCircle className="text-rose-600 shrink-0" size={22} />
              )}
            </div>

            <div className="space-y-2">
              {item.options.map((option, optionIndex) => {
                const isCorrectOption = option === item.correctAnswer;
                const isSelectedOption = option === item.selectedAnswer;
                const optionClasses = isCorrectOption
                  ? "border-emerald-300 bg-emerald-50"
                  : isSelectedOption && !item.isCorrect
                  ? "border-rose-300 bg-rose-50"
                  : "border-slate-200 bg-slate-50";

                return (
                  <div key={optionIndex} className={`rounded-xl border px-4 py-3 ${optionClasses}`}>
                    <div className="text-sm text-slate-800">{option}</div>
                  </div>
                );
              })}
            </div>

            {item.explanation && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-xs text-slate-500 mb-1">Explanation</div>
                <div className="text-sm text-slate-700">{item.explanation}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResultPage;
