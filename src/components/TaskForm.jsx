import { useState } from "react";

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
      });
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Gagal menambah task. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-5 bg-white/50 border border-white/60 rounded-2xl flex flex-col gap-4 shadow-sm">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Apa yang ingin Anda kerjakan?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm disabled:bg-slate-50 font-medium"
          maxLength={200}
          required
        />

        <textarea
          placeholder="Tambahkan deskripsi (opsional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          rows={2}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm resize-none disabled:bg-slate-50"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-medium px-1">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-brand-md hover:shadow-brand-lg transform hover:-translate-y-0.5"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Menyimpan...
          </span>
        ) : (
          <>
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-brand-300 group-hover:text-brand-200 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </span>
            Tambah Task
          </>
        )}
      </button>
    </form>
  );
}