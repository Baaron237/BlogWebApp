/* eslint-disable @typescript-eslint/no-explicit-any */
export type Post = {
  id: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  likeCount: number;
  viewCount: number;
  createdAt: string;
  likedByUsers?: {id: string}[];
  reactionsByUsers?: {Reaction: {emoji: string}, userId: string}[];
  [key: string]: any;
};

export type Theme = {
  backgroundColor: string;
  textColor: string;
  secondaryColor?: string;
  [key: string]: any;
};

export type Reaction = {
  emoji: string;
  count: number;
};