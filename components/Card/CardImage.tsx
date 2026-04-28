export default function CardImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  return (
    <div className="w-full aspect-video bg-gray-200 overflow-hidden">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-300" />
      )}
    </div>
  );
}
