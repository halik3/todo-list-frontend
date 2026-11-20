export default function SkeletonTaskList({ count = 4 }) {
  return (
    <ul aria-label="Memuat task...">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="flex items-start gap-3 border border-brand-100 rounded-lg p-4 mb-2 bg-white animate-pulse"
        >
          <div className="w-5 h-5 rounded bg-brand-100 mt-1" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-brand-100 rounded w-3/4" />
            <div className="h-3 bg-brand-50 rounded w-1/2" />
          </div>
          <div className="w-16 h-6 bg-brand-100 rounded-full" />
        </li>
      ))}
    </ul>
  );
}