import { useEffect, useRef, useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDesc, setDraftDesc] = useState(task.description || "");
  const titleRef = useRef(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!editing) {
      setDraftTitle(task.title);
      setDraftDesc(task.description || "");
    }
  }, [task.title, task.description, editing]);

  useEffect(() => {
    if (editing) {
      cancelRef.current = false;
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [editing]);

  const handleSave = async () => {
    if (cancelRef.current) {
      cancelRef.current = false;
      setDraftTitle(task.title);
      setDraftDesc(task.description || "");
      setEditing(false);
      return;
    }

    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      setDraftTitle(task.title);
      setEditing(false);
      return;
    }

    const trimmedDesc = draftDesc.trim();
    if (trimmedTitle === task.title && trimmedDesc === (task.description || "")) {
      setEditing(false);
      return;
    }

    try {
      await onUpdate(task.id, {
        title: trimmedTitle,
        description: trimmedDesc || null,
        is_completed: task.is_completed,
      });
    } finally {
      setEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      cancelRef.current = true;
      setEditing(false);
    }
  };

  // --- MODE EDIT (Dibuat lebih ringkas) ---
  if (editing) {
    return (
      <li className="flex items-start gap-3 border-2 border-brand-400 rounded-xl p-3 mb-2 bg-white shadow-sm animate-fade-in-up relative z-10">
        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={titleRef}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border-b border-slate-300 rounded-none px-0 py-0.5 font-bold text-base text-brand-900 focus:outline-none focus:border-brand-500 bg-transparent placeholder-slate-400"
            placeholder="Judul task"
            maxLength={200}
          />
          <textarea
            value={draftDesc}
            onChange={(e) => setDraftDesc(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none bg-slate-50"
            placeholder="Deskripsi (opsional)"
            rows={1}
          />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="bg-brand-600 text-white text-[11px] font-bold rounded px-3 py-1 hover:bg-brand-700 transition-all shadow-sm"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                cancelRef.current = true;
                setEditing(false);
              }}
              className="bg-slate-100 text-slate-600 text-[11px] font-bold rounded px-3 py-1 hover:bg-slate-200 transition-all"
            >
              Batal
            </button>
          </div>
        </div>
      </li>
    );
  }

  // --- MODE NORMAL (Checkbox lebih tegas) ---
  return (
    <li className="group flex items-start gap-3 p-3 mb-2 bg-white/80 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 animate-fade-in-up">
      
      {/* Checkbox Baru: Lebih tegas dan berwarna */}
      <label className="relative flex items-center cursor-pointer mt-1 shrink-0">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => onToggle(task)}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border-2 border-slate-400 rounded bg-white peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-all flex items-center justify-center shadow-sm">
          <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </label>

      <div className="flex-1 min-w-0">
        <p
          onClick={() => setEditing(true)}
          className={`font-semibold text-[15px] break-words cursor-text transition-colors leading-tight ${
            task.is_completed ? "line-through text-slate-400 decoration-slate-300 decoration-2" : "text-slate-800 group-hover:text-brand-600"
          }`}
          title="Klik untuk edit"
        >
          {task.title}
        </p>
        
        {task.description && (
          <p
            onClick={() => setEditing(true)}
            className={`text-xs mt-1 cursor-text break-words leading-snug ${
              task.is_completed ? "text-slate-400" : "text-slate-500"
            }`}
            title="Klik untuk edit"
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
            task.is_completed
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-amber-50 text-amber-600 border border-amber-200"
          }`}
        >
          {task.is_completed ? "Selesai" : "Pending"}
        </span>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-all duration-200"
          title="Hapus task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}