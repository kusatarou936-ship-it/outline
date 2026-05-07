import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
    const cookieStore = cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return (
                        cookieStore.get(name)?.value ||
                        cookieStore.get(`__Host-${name}`)?.value
                    );
                },
                set(name, value, options) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // Route handlers では set が使えないので無視
                    }
                },
                remove(name, options) {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch {
                        // 同上
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <html lang="ja">
            <body>{children}</body>
        </html>
    );
}
