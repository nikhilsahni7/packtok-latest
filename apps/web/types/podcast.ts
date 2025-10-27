export interface Podcast {
  id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  duration: string;
  likes: number;
  comments: number;
  tags: string[];
  publishedAt: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  comment: string;
  timestamp: string;
  likes: number;
}
