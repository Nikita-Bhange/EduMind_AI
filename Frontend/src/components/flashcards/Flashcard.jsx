import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full h-72" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of the card (Question) */}
        <div
          className="absolute inset-0 w-full h-full bg-white/80 dark:bg-[#151515]/95 backdrop-blur-xl border-2 border-slate-200/60 dark:border-[#2f2f2f] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-[#7A00FF]/20 p-8 flex flex-col justify-between "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Star Button */}
          <div className="flex items-start justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                flashcard.isStarred
                  ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-400 dark:bg-[#1c1c1c] dark:text-slate-500 dark:hover:bg-[#242424]"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">
              {flashcard.question}
            </p>
          </div>
        </div>

              {/* flip indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={2}/>
                <span>click to reveal answer</span>
              </div>
        {/* Back of the card (Answer) */}
        <div
          className="absolute inset-0 w-full h-full bg-linear-to-br from-emerald-500 to-teal-500 dark:from-[#FF3CAC] dark:to-[#784BA0] border-2 border-emerald-200/60 dark:border-[#784BA0]/60 rounded-2xl shadow-xl shadow-emerald-500/30 dark:shadow-[#7A00FF]/30 p-8 flex flex-col justify-between "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Star Button */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                flashcard.isStarred
                  ? "bg-white/30 backdrop-blur-sm text-white border border-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-lg font-semibold text-white text-center">
              {flashcard.answer}
            </p>
          </div>
           {/* flip indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/75 font-medium">
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={2}/>
                <span>click to see question</span>
              </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

