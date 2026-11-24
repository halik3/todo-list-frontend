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
import AuthForm from "./components/AuthForm";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortBy, setSortBy] = useState("default");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Jangan fetch data jika belum login
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTasks();
        if (!cancelled) setTasks(data);
      } catch (err) {
        if (!cancelled) {
          setError("Gagal memuat task. Sesi Anda mungkin berakhir.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
    toast.success("Berhasil keluar");
  };

  const displayedTasks = useMemo(() => {
    let result = [...tasks];
    if (filter === "pending") result = result.filter((t) => !t.is_completed);
    else if (filter === "completed") result = result.filter((t) => t.is_completed);

    if (sortBy === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "status") result.sort((a, b) => Number(a.is_completed) - Number(b.is_completed));

    return result;
  }, [tasks, sortBy, filter]);

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
      toast.success(updated.is_completed ? "Task ditandai selesai" : "Task dibuka kembali");
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateTask(id, data);
      if (updated && updated.id) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        const fresh = await getTasks();
        setTasks(fresh);
      }
      toast.success("Task diperbarui");
    } catch (err) {
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
      {/* Ornamen Background Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '2000ms' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" style={{ animationDelay: '4000ms' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* KONDISI: Jika belum login, tampilkan AuthForm */}
        {!token ? (
          <AuthForm onAuthSuccess={() => setToken(localStorage.getItem("token"))} />
        ) : (
          <>
            <header className="mb-10 flex flex-col items-center justify-between sm:flex-row relative">
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 flex items-center justify-center sm:justify-start gap-3 drop-shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-10 h-10 text-brand-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 2.25v3.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V2.25m3 7.5h-6m6 3h-6m3 3h-3" />
                  </svg>
                  ToDo List
                </h1>
                <p className="text-brand-600/80 mt-2 font-medium">Kelola tugas harian Anda dengan elegan</p>
              </div>
              
              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="mt-4 sm:mt-0 flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Keluar
              </button>
            </header>

            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-glass border border-white/60 p-5 sm:p-7">
              <TaskForm onSubmit={handleCreate} />

              {!loading && !error && tasks.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mb-5 pb-4 border-b border-slate-200/60 gap-3">
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <div className="flex items-center bg-slate-100/50 p-1 rounded-lg w-fit">
                      {[
                        { id: "all", label: "Semua" },
                        { id: "pending", label: "Pending" },
                        { id: "completed", label: "Selesai" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setFilter(tab.id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            filter === tab.id
                              ? "bg-white text-brand-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium px-1">
                      <span className="font-bold text-brand-600">
                        {tasks.filter((t) => !t.is_completed).length}
                      </span> pending ·{" "}
                      <span className="font-bold text-emerald-600">
                        {tasks.filter((t) => t.is_completed).length}
                      </span> selesai
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <label htmlFor="sort" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Urutkan
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer hover:bg-white transition-colors font-medium"
                    >
                      <option value="default">Terbaru</option>
                      <option value="title">Judul (A-Z)</option>
                      <option value="status">Status</option>
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
                  tasks={displayedTasks}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              )}

              {!loading && !error && displayedTasks.length === 0 && tasks.length > 0 && (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 font-medium">Tidak ada task di kategori ini.</p>
                </div>
              )}
            </div>

            <footer className="mt-10 text-center text-xs text-slate-400 font-medium">
              Dibangun dengan React, Vite, FastAPI & Neon PostgreSQL
            </footer>
          </>
        )}
      </div>
    </div>
  );
}