import Link from "next/link";
import CardImage from "./CardImage";
import CardMeta from "./CardMeta";

export default function Card({
  id,
  title,
  catchcopy,
  thumbnail,
  stack,
}: {
  id: string;
  title: string;
  catchcopy: string | null;
  thumbnail: string | null;
  stack: string[];
}) {
  return (
    <Link
      href={`/work/${id}`}
      aria-label={`${title} の詳細ページへ`}
      className="block rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-white overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <CardImage src={thumbnail} alt={title} />
      <CardMeta title={title} catchcopy={catchcopy} stack={stack} />
    </Link>
  );
}
