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
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 bg-gray-50 border rounded-lg flex flex-col gap-3"
    >
      <h2 className="font-semibold text-gray-700">Tambah Task Baru</h2>

      <input
        type="text"
        placeholder="Judul task *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
        maxLength={200}
        required
      />

      <textarea
        placeholder="Deskripsi (opsional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={submitting}
        rows={2}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-200"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="bg-blue-600 text-white font-medium rounded px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Menyimpan..." : "Tambah Task"}
      </button>
    </form>
  );
}