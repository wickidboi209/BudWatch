export type ExperienceFormParams = {
  movieId: string;
  movieTitle: string;
  editExperience?: {
    id: string;
    budScore: number;
    mood: string;
    notes: string;
    containsSpoilers: boolean;
  };
};

export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetail: { movieId: string };
  ExperienceForm: ExperienceFormParams;
  VibeResults: { vibeId: string };
  CommunityFeed: undefined;
  Watchlist: undefined;
  CrewDetail: { crewId: string; crewName: string };
};
