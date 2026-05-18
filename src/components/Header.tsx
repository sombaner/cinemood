type View = "discover" | "favorites";

type Props = {
  view: View;
  favoritesCount: number;
  onChange: (view: View) => void;
};

export function Header({ view, favoritesCount, onChange }: Props) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-emoji" aria-hidden>🎬</span>
        <h1>cinemood</h1>
        <span className="brand-tag">movies by mood</span>
      </div>
      <nav className="tabs">
        <button
          className={view === "discover" ? "tab active" : "tab"}
          onClick={() => onChange("discover")}
        >
          Discover
        </button>
        <button
          className={view === "favorites" ? "tab active" : "tab"}
          onClick={() => onChange("favorites")}
        >
          Favorites
          {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
        </button>
      </nav>
    </header>
  );
}
