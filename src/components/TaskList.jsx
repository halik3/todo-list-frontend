import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-3">📭</div>
        <p className="text-brand-600 font-medium">Belum ada task.</p>
        <p className="text-brand-400 text-sm mt-1">
          Yuk tambah task pertama Anda di atas!
        </p>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}   /* ⬅️ PROP INI WAJIB ADA */
        />
      ))}
    </ul>
  );
}