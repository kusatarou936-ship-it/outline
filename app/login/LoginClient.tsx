"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginClient() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const searchParams = useSearchParams();
    const raw = searchParams.get("redirectTo");
    const redirectTo =
        !raw || raw.startsWith("/login") ? "/" : raw;

    async function submit() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMsg("Invalid email or password");
            return;
        }

        window.location.href = redirectTo;
    }

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-semibold">Login</h1>

                <input
                    className="w-full p-3 bg-white/10 rounded"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full p-3 bg-white/10 rounded"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={submit}
                    className="w-full p-3 bg-white text-black rounded font-medium"
                >
                    Login
                </button>

                {msg && <p className="text-sm opacity-80">{msg}</p>}
            </div>
        </main>
    );
}
