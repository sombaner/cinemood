import { useEffect, useRef, useState } from "react";

type Props = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function SearchBar({ onSearch, placeholder = "Search for a movie…" }: Props) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden>🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => setValue("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
