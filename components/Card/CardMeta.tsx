export default function CardMeta({
  title,
  catchcopy,
  stack,
}: {
  title: string;
  catchcopy: string | null;
  stack: string[];
}) {
  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      {catchcopy && (
        <p className="text-sm text-gray-600 line-clamp-2">{catchcopy}</p>
      )}

      {stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {stack.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
