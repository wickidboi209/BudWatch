export type Vibe = {
  id: string;
  label: string;
  colorFrom: string;
  colorTo: string;
  genreIds: number[];
};

// TMDB genre ids used for foundation-phase matching. Once enough real
// experiences exist, this can be replaced/blended with community data
// (see src/services/experiences.ts). Each vibe's face icon lives in
// VibeFace.tsx, keyed by id.
export const VIBES: Vibe[] = [
  { id: "lock-in", label: "Lock In", colorFrom: "#5B6EE8", colorTo: "#2E3A8F", genreIds: [9648, 53] },
  { id: "main-character", label: "Main Character Energy", colorFrom: "#E0B84A", colorTo: "#A67C1E", genreIds: [12, 10749] },
  { id: "in-my-feels", label: "In My Feels", colorFrom: "#C97B93", colorTo: "#7D3F52", genreIds: [18] },
  { id: "laughing", label: "Laughing at Everything", colorFrom: "#F0875A", colorTo: "#B4502A", genreIds: [35] },
  { id: "mind-melting", label: "Mind Melting", colorFrom: "#A05EE0", colorTo: "#5C2E8F", genreIds: [878, 14] },
  { id: "warm-fuzzy", label: "Warm and Fuzzy", colorFrom: "#D98456", colorTo: "#9C4A26", genreIds: [10751, 35] },
  { id: "edge-of-seat", label: "Edge of My Seat", colorFrom: "#C23F58", colorTo: "#7A1F30", genreIds: [53, 27] },
  { id: "zoned-out", label: "Zoned Out", colorFrom: "#6E8195", colorTo: "#3E4C58", genreIds: [16, 35] },
  { id: "wide-awake", label: "Wide Awake", colorFrom: "#3FC2B8", colorTo: "#1D7B73", genreIds: [28, 80] },
  { id: "spiraling", label: "Spiraling", colorFrom: "#5A3F73", colorTo: "#241A30", genreIds: [27, 9648] },
  { id: "delulu", label: "Delulu", colorFrom: "#E064AC", colorTo: "#9C2F70", genreIds: [10749, 14] },
  { id: "brain-rot", label: "Brain Rot", colorFrom: "#8A9A4E", colorTo: "#52602A", genreIds: [35, 28] },
];

export const getVibe = (id: string): Vibe | undefined => VIBES.find((vibe) => vibe.id === id);
