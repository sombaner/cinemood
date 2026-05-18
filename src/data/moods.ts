export type Mood = {
  key: string;
  label: string;
  emoji: string;
  genres: number[];
  extraParams?: Record<string, string>;
};

export const MOODS: Mood[] = [
  { key: "happy",       label: "Happy",       emoji: "😊", genres: [35, 10751, 16] },
  {
    key: "sad",         label: "Sad",         emoji: "😢", genres: [18, 10749],
    extraParams: { "vote_count.gte": "500", sort_by: "vote_average.desc" },
  },
  { key: "adventurous", label: "Adventurous", emoji: "🗺️", genres: [12, 28] },
  { key: "romantic",    label: "Romantic",    emoji: "💕", genres: [10749] },
  { key: "thrilled",    label: "Thrilled",    emoji: "😱", genres: [53, 9648] },
  { key: "spooked",     label: "Spooked",     emoji: "👻", genres: [27] },
  { key: "inspired",    label: "Inspired",    emoji: "✨", genres: [18, 36] },
  {
    key: "nostalgic",   label: "Nostalgic",   emoji: "📼", genres: [18, 35],
    extraParams: { "primary_release_date.lte": "1999-12-31", "vote_count.gte": "200" },
  },
  { key: "chill",       label: "Chill",       emoji: "😌", genres: [16, 35] },
  { key: "curious",     label: "Curious",     emoji: "🤔", genres: [99, 878] },
];
