import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-blue-50 to-brand-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-brand-800 flex items-center justify-center gap-2">
            <span className="text-4xl">📝</span>
            ToDo List
          </h1>
          <p className="text-brand-600 mt-1 text-sm">Kelola tugas harian Anda</p>
        </header>

        <div className="bg-white rounded-2xl shadow-brand-md border border-brand-100 p-6">
          <TaskForm onSubmit={handleCreate} />

          {loading && <SkeletonTaskList />}

          {error && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {!loading && !error && (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-brand-500">
          ToDo List with React, Vite, FastAPI & Neon PostgreSQL
        </footer>
      </div>
    </div>
  );
}