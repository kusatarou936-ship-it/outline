"use client";

import { useState } from "react";

export default function HomePage() {
  const [unlocked, setUnlocked] = useState(false);

  const handleWatchAd = async () => {
    setUnlocked(true);
  };

  if (unlocked) {
    window.location.href = "/feed";
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <section className="text-center space-y-8">

          <div className="space-y-2">
            <h1 className="text-2xl font-medium">Outline JA</h1>
            <p className="opacity-80">
              作品を静かに並べていく、小さなギャラリーです。
            </p>
          </div>

          {/* 以下そのまま */}

        </section>
      </div>
    </div>
  );
}
