type WorkCardProps = {
  title: string;
  status: "prototype" | "beta" | "release";
  stack: string[];
  thumbnail: string;
};

export function WorkCard({ title, status, stack, thumbnail }: WorkCardProps) {
  return (
    <div
      className="
        group
        h-[320px]
        rounded-2xl
        bg-white/5
        shadow-[0_4px_16px_rgba(0,0,0,0.08)]
        overflow-hidden
        transition-all
        duration-300
        hover:bg-white/10
      "
    >
      {/* サムネイル */}
      <div className="aspect-video w-full overflow-hidden bg-white/10">
        <img
          src={thumbnail}
          alt=""
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.03]
          "
        />
      </div>

      {/* 本文 */}
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-medium line-clamp-1">{title}</h2>

        <span
          className="
            inline-block
            text-xs
            px-2 py-0.5
            rounded-full
            bg-white/10
            border border-white/10
            uppercase tracking-wide
          "
        >
          {status}
        </span>

        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className="
                text-xs
                px-2 py-0.5
                rounded-full
                bg-white/5
                border border-white/10
                opacity-80
                group-hover:opacity-100
                transition-opacity
              "
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
