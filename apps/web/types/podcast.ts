export type PodcastReactionType = "LIKE" | "DISLIKE";

export interface PodcastListItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  duration: number | null;
  releaseDate: string | null;
  tags: string[];
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  viewCount: number;
  series: {
    id: string;
    title: string;
  } | null;
}

export interface PodcastDetail extends PodcastListItem {
  videoUrl: string | null;
  userReaction: PodcastReactionType | null;
  series:
    | {
        id: string;
        title: string;
        episodeNumber: number | null;
        totalEpisodes: number;
      }
    | null;
}

export interface PodcastUser {
  id: string;
  name: string;
  profile_image: string | null;
}

export interface PodcastComment {
  id: string;
  podcastId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: PodcastUser;
  replies?: PodcastComment[];
  replyCount?: number;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
