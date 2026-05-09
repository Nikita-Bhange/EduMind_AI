import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, History, Lightbulb, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import aiService from "../../services/aiService";
import Modal from "../common/Modal";
import MarkdownRender from "../common/MarkdownRender";

const AIActions = () => {
  const { id: documentId } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");
  const [view, setView] = useState("actions");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const openResult = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await aiService.getActionHistory(documentId);
      setHistory(response?.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch AI history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleShowHistory = async () => {
    setView("history");
    await fetchHistory();
  };

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const response = await aiService.generateSummary(documentId);
      const summary = response?.summary || response?.data?.summary || response;
      openResult("Generated Summary", summary);
      await fetchHistory();
    } catch (error) {
      toast.error(error?.message || "Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (event) => {
    event.preventDefault();

    const conceptText = concept.trim();
    if (!conceptText) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");
    try {
      const response = await aiService.explainConcept(documentId, conceptText);
      const explanation = response?.explanation || response?.data?.explanation || response;
      openResult(`Explanation of "${conceptText}"`, explanation);
      setConcept("");
      await fetchHistory();
    } catch (error) {
      toast.error(error?.message || "Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 px-6 py-5 dark:border-[#2f2f2f] dark:from-[#151515] dark:to-[#1c1c1c]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg">
              {view === "history" ? (
                <History className="h-5 w-5 text-white" strokeWidth={2} />
              ) : (
                <Sparkles className="h-5 w-5 text-white" strokeWidth={2} />
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {view === "history" ? "History" : "Assistant"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {view === "history" ? "Previous generated data" : "Powered by advanced AI"}
              </p>
            </div>
          </div>

          {view === "history" ? (
            <button
              type="button"
              onClick={() => setView("actions")}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-[#2f2f2f] dark:bg-[#1c1c1c] dark:text-slate-200 dark:hover:border-[#784BA0] dark:hover:text-[#ff8bcb]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleShowHistory}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-[#2f2f2f] dark:bg-[#1c1c1c] dark:text-slate-200 dark:hover:border-[#784BA0] dark:hover:text-[#ff8bcb]"
            >
              <History className="h-4 w-4" />
              History
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {view === "history" ? (
          <div className="space-y-3">
            {historyLoading ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-[#2f2f2f] dark:bg-[#151515] dark:text-slate-400">
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center dark:border-[#2f2f2f] dark:bg-[#151515]">
                <History className="mx-auto mb-3 h-8 w-8 text-slate-400 dark:text-slate-500" />
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">No history yet</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Generated summaries and explained topics will appear here.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => openResult(item.title, item.content)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-[#2f2f2f] dark:bg-[#151515] dark:hover:border-[#784BA0] dark:hover:bg-[#21182a]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </div>
                      {item.prompt && (
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Topic: {item.prompt}
                        </div>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold capitalize text-emerald-700 dark:bg-[#2a1830] dark:text-[#ff8bcb]">
                      {item.type}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </button>
              ))
            )}
          </div>
        ) : (
          <>
            <div className="group rounded-xl border border-slate-200 bg-linear-to-br from-slate-50/50 to-white p-5 dark:border-[#2f2f2f] dark:from-[#151515] dark:to-[#1c1c1c]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-100 to-teal-100 dark:from-[#2a1830] dark:to-[#1f1a33]">
                      <BookOpen className="h-4 w-4 text-emerald-600 dark:text-[#ff8bcb]" strokeWidth={2} />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Generate Summary
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Get a concise summary of the entire document.
                  </p>
                </div>

                <button
                  onClick={handleGenerateSummary}
                  disabled={loadingAction === "summary"}
                  className="h-10 shrink-0 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 px-5 text-white hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 dark:from-[#FF3CAC] dark:to-[#784BA0] dark:hover:from-[#ff57b8] dark:hover:to-[#8a57b2]"
                >
                  {loadingAction === "summary" ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Loading...
                    </span>
                  ) : (
                    "Summarize"
                  )}
                </button>
              </div>
            </div>

            <div className="group rounded-xl border border-slate-200 bg-linear-to-br from-slate-50/50 to-white p-5 dark:border-[#2f2f2f] dark:from-[#151515] dark:to-[#1c1c1c]">
              <form onSubmit={handleExplainConcept}>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-100 to-orange-100">
                    <Lightbulb className="h-4 w-4 text-amber-600" strokeWidth={2} />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Explain a Concept
                  </h4>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Enter a topic or concept from the document to get a detailed explanation.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={concept}
                    onChange={(event) => setConcept(event.target.value)}
                    placeholder="e.g. React Hooks"
                    className="h-11 flex-1 border-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:outline-none focus-visible:border-emerald-500 focus:shadow-lg focus:shadow-emerald-300/50 dark:border-[#2f2f2f] dark:bg-[#1c1c1c] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-[#202020] dark:focus-visible:border-[#FF3CAC] dark:focus:shadow-[#7A00FF]/30"
                    disabled={loadingAction === "explain"}
                  />
                  <button
                    type="submit"
                    disabled={loadingAction === "explain" || !concept.trim()}
                    className="h-11 shrink-0 rounded-2xl bg-linear-to-br from-emerald-600 to-emerald-500 px-5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50 dark:from-[#FF3CAC] dark:to-[#784BA0] dark:shadow-[#7A00FF]/30 dark:hover:from-[#ff57b8] dark:hover:to-[#8a57b2]"
                  >
                    {loadingAction === "explain" ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Loading...
                      </span>
                    ) : (
                      "Explain"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} title={modalTitle} onClose={() => setIsModalOpen(false)}>
        <div className="max-h-[60vh] overflow-y-auto">
          <MarkdownRender content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;
