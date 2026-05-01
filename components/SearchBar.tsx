"use client";

export function SearchBar() {
  return (
    <div role="search" className="mb-10">
      <input
        type="text"
        placeholder="Search works..."
        className="
          w-full
          px-4 py-3
          rounded-xl
          bg-white/5
          border border-white/10
          text-white
          placeholder-white/40
          outline-none
          transition-all
          duration-300
          focus:border-white/20
          focus:bg-white/10
        "
      />
    </div>
  );
}
