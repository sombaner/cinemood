import { MOODS, type Mood } from "../data/moods";

type Props = {
  activeKey: string | null;
  onSelect: (mood: Mood) => void;
};

export function MoodPicker({ activeKey, onSelect }: Props) {
  return (
    <section className="mood-picker" aria-label="Choose a mood">
      <h2 className="section-title">How are you feeling?</h2>
      <div className="mood-chips">
        {MOODS.map((mood) => (
          <button
            key={mood.key}
            type="button"
            className={mood.key === activeKey ? "mood-chip active" : "mood-chip"}
            onClick={() => onSelect(mood)}
          >
            <span className="mood-emoji" aria-hidden>{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
