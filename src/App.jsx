import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from "./api/tasks";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

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
          setError(
            "Gagal memuat task. Pastikan backend berjalan di http://127.0.0.1:8000."
          );
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
    const newTask = await createTask(data);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (task) => {
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus task ini?")) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Gagal menghapus task. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">ToDo List Wini</h1>

        <TaskForm onSubmit={handleCreate} />

        {loading && (
          <p className="text-center text-gray-500">Memuat data...</p>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 p-3 rounded">
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
    </div>
  );
}