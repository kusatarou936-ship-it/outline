export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function HomePage() {
  const API = process.env.NEXT_PUBLIC_API_BASE;

  // 安全な初期値を let で宣言（後で上書き可能）
  let data: {
    stacks: Record<string, number>;
    purposes: Record<string, number>;
    focuses: Record<string, number>;
    newWorks: any[];
    updatedWorks: any[];
    newUsers: any[];
  } = {
    stacks: {},
    purposes: {},
    focuses: {},
    newWorks: [],
    updatedWorks: [],
    newUsers: []
  };

  try {
    if (!API) throw new Error("NEXT_PUBLIC_API_BASE is not set");
    const res = await fetch(`${API}/api/home`, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("fetch /api/home failed status", res.status, text);
    } else {
      const parsed = await res.json().catch((e) => {
        console.error("res.json() failed", e);
        return null;
      });
      if (parsed) {
        data = {
          stacks: parsed.stacks ?? {},
          purposes: parsed.purposes ?? {},
          focuses: parsed.focuses ?? {},
          newWorks: Array.isArray(parsed.newWorks) ? parsed.newWorks : [],
          updatedWorks: Array.isArray(parsed.updatedWorks) ? parsed.updatedWorks : [],
          newUsers: Array.isArray(parsed.newUsers) ? parsed.newUsers : []
        };
      }
    }
  } catch (e) {
    console.error("Error fetching /api/home in SSR", e);
    // data は既に安全なデフォルト
  }

  // 以下は既存のレンダリング処理（data をそのまま使う）
  const sortedStacks = Object.entries(data.stacks).sort((a, b) => b[1] - a[1]);
  const sortedPurposes = Object.entries(data.purposes).sort((a, b) => b[1] - a[1]);
  const sortedFocuses = Object.entries(data.focuses).sort((a, b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      {/* 以降は既存の JSX をそのまま使ってください */}
    </main>
  );
}

function Section({ title, items }: any) {
  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {safeItems.map((w: any) => (
          <a key={w.id} href={`/work/${w.id}`} className="group block ...">
            <div className="aspect-video bg-white/10 overflow-hidden">
              <img
                src={w.image_url ?? "https://placehold.co/1280x720/000/FFF?text=No+Thumbnail"}
                alt={w.title ?? ""}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-lg font-medium">{w.title}</h3>
              <p className="text-sm opacity-60">{w.description ?? ""}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function UsersSection({ title, items }: any) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((u: any) => (
          <a
            key={u.id}
            href={`/user/${u.id}`}
            className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <p className="font-medium">{u.name}</p>
            <p className="text-xs opacity-60">Joined</p>
          </a>
        ))}
      </div>
    </section>
  );
}
