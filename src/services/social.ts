export type ReactionType = "😂" | "🤯" | "🔥" | "😭" | "❤️";

export const reactionTypes: ReactionType[] = ["😂", "🤯", "🔥", "😭", "❤️"];

export type SocialComment = {
  id: string;
  username: string;
  avatar: string;
  text: string;
  replyTo?: string;
};

export type ActivityItem = {
  id: string;
  username: string;
  avatar: string;
  movieTitle: string;
  poster: string;
  budScore: number;
  experience: string;
  timestamp: string;
  reactions: Record<ReactionType, number>;
  comments: SocialComment[];
};

export type CrewMember = {
  id: string;
  username: string;
  avatar: string;
  status: string;
};

const avatar = (id: number) => `https://i.pravatar.cc/100?img=${id}`;

export const crewMembers: CrewMember[] = [
  { id: "maya", username: "maya.makesmovies", avatar: avatar(47), status: "Watching something weird" },
  { id: "jordan", username: "jordanframes", avatar: avatar(12), status: "In a sci-fi mood" },
  { id: "sam", username: "samafterdark", avatar: avatar(32), status: "Finding a comfort watch" },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "activity-arrival",
    username: "maya.makesmovies",
    avatar: avatar(47),
    movieTitle: "Arrival",
    poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    budScore: 9,
    experience: "Quiet, enormous, and somehow warmer every time I watch it.",
    timestamp: "12 min ago",
    reactions: { "😂": 0, "🤯": 12, "🔥": 8, "😭": 4, "❤️": 15 },
    comments: [
      { id: "arrival-comment-1", username: "jordanframes", avatar: avatar(12), text: "The sound design is unreal." },
      { id: "arrival-comment-2", username: "samafterdark", avatar: avatar(32), text: "Absolutely. That final act stays with you.", replyTo: "arrival-comment-1" },
    ],
  },
  {
    id: "activity-spider-verse",
    username: "jordanframes",
    avatar: avatar(12),
    movieTitle: "Spider-Man: Into the Spider-Verse",
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    budScore: 8,
    experience: "Pure color, perfect momentum. This is still the best kind of rewatch.",
    timestamp: "1 hr ago",
    reactions: { "😂": 9, "🤯": 8, "🔥": 21, "😭": 2, "❤️": 18 },
    comments: [{ id: "spider-comment-1", username: "maya.makesmovies", avatar: avatar(47), text: "The leap of faith scene gets me every time." }],
  },
];