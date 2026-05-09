import React from 'react'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'
import {FileText, Trash2, BookOpen, BrainCircuit, Clock} from 'lucide-react'

// helper f() to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(document)
  }

  return (
    <div
      className="group relative bg-white/80 dark:bg-[#151515]/90 backdrop-blur-xl border border-slate-200/60 dark:border-[#2f2f2f] rounded-2xl p-5 hover:border-emerald-300 dark:hover:border-[#784BA0] hover:shadow-2xl hover:shadow-emerald-100/70 dark:hover:shadow-[#7A00FF]/20 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
      onClick={handleNavigate}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="shrink-0 w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 dark:from-[#FF3CAC] dark:to-[#784BA0] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 dark:shadow-[#7A00FF]/30 group-hover:scale-110 transition-transform duration-200">
          <FileText className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-opacity duration-200"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <h3
        className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate mb-2"
        title={document.title}
      >
        {document.title}
      </h3>

      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
        {document.fileSize !== undefined && (
          <span className="font-medium">{formatFileSize(document.fileSize)}</span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        {document.flashcardCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-[#2a1830] rounded-lg">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-[#ff8bcb]" strokeWidth={2} />
            <span className="text-xs font-semibold text-emerald-700 dark:text-[#ffb3dc]">{document.flashcardCount} Flashcards</span>
          </div>
        )}
        {document.quizCount !== undefined && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 dark:bg-[#1c1c1c] rounded-lg">
            <BrainCircuit className="w-3.5 h-3.5 text-teal-600 dark:text-[#c090ff]" strokeWidth={2} />
            <span className="text-xs font-semibold text-teal-700 dark:text-[#d4b2ff]">{document.quizCount} Quizzes</span>
          </div>
        )}
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 dark:border-[#2a2a2a]">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Uploaded {moment(document.createdAt).fromNow()}</span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 dark:group-hover:from-[#FF3CAC]/10 dark:group-hover:to-[#784BA0]/10 transition-all duration-300 pointer-events-none" />
    </div>
  )
}

export default DocumentCard
