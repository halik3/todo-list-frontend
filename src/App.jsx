import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "./api/tasks";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import SkeletonTaskList from "./components/SkeletonTaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTasks();
        if (!cancelled) setTasks(data);
      } catch (err) {
        if (!cancelled) {
          setError("Gagal memuat task. Pastikan backend berjalan.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedTasks = useMemo(() => {
    const copy = [...tasks];
    if (sortBy === "title") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "status") {
      copy.sort((a, b) => Number(a.is_completed) - Number(b.is_completed));
    }
    return copy;
  }, [tasks, sortBy]);

  const handleCreate = async (data) => {
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Task berhasil ditambahkan");
    } catch {
      toast.error("Gagal menambah task");
    }
  };

  const handleToggle = async (task) => {
    try {
      let updated;
      if (!task.is_completed) {
        updated = await completeTask(task.id);
      } else {
        updated = await updateTask(task.id, {
          title: task.title,
          description: task.description,
          is_completed: false,
        });
      }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      toast.success(
        updated.is_completed ? "Task ditandai selesai" : "Task dibuka kembali"
      );
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  // ⬇️ INI FUNGSI YANG HILANG SEBELUMNYA
  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateTask(id, data);
      console.log("[App] handleUpdate response:", updated);

      if (updated && updated.id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        // Fallback: kalau response kosong, refetch
        const fresh = await getTasks();
        setTasks(fresh);
      }
      toast.success("Task diperbarui");
    } catch (err) {
      console.error("[App] handleUpdate error:", err);
      toast.error("Gagal memperbarui task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus task ini?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task dihapus");
    } catch {
      toast.error("Gagal menghapus task");
    }
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-brand-100 via-indigo-100 to-pink-100 py-12 px-4 relative overflow-hidden">
      {/* Ornamen Background Blob (Sekarang akan bergerak) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2000ms' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4000ms' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
         <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 flex items-center justify-center gap-3 drop-shadow-sm">
            {/* Logo SVG Clipboard/Checklist */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 2.25v3.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V2.25m3 7.5h-6m6 3h-6m3 3h-3" />
            </svg>
            ToDo List
          </h1>
          <p className="text-brand-600/80 mt-2 font-medium">Kelola tugas harian Anda dengan elegan</p>
        </header>
           <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-glass border border-white/60 p-5 sm:p-7">
          <TaskForm onSubmit={handleCreate} />

          {!loading && !error && tasks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-slate-200/60 gap-3">
              <p className="text-sm text-slate-500 font-medium bg-slate-100/50 px-3 py-1 rounded-full">
                <span className="font-bold text-brand-600">
                  {tasks.filter((t) => !t.is_completed).length}
                </span>{" "}
                pending ·{" "}
                <span className="font-bold text-emerald-600">
                  {tasks.filter((t) => t.is_completed).length}
                </span>{" "}
                selesai
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Urutkan
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer hover:bg-white transition-colors"
                >
                  <option value="default">Terbaru</option>
                  <option value="title">Judul (A-Z)</option>
                  <option value="status">Status (Pending dulu)</option>
                </select>
              </div>
            </div>
          )}

          {loading && <SkeletonTaskList />}

          {error && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {!loading && !error && (
            <TaskList
              tasks={sortedTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400 font-medium">
          Dibangun dengan React, Vite, FastAPI & Neon PostgreSQL
        </footer>
      </div>
    </div>
  );
}