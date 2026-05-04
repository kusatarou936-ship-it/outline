export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
