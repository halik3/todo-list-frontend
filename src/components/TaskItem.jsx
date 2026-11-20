export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-start gap-3 border rounded-lg p-4 mb-2 bg-white shadow-sm group">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={() => onToggle(task)}
        className="w-5 h-5 mt-1 cursor-pointer accent-blue-600"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium break-words ${
            task.is_completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`text-sm break-words mt-1 ${
              task.is_completed ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full shrink-0 ${
          task.is_completed
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {task.is_completed ? "Selesai" : "Pending"}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-600 transition-colors px-2 font-bold shrink-0 text-lg"
        title="Hapus task"
        aria-label="Hapus task"
      >
        ✕
      </button>
    </li>
  );
}