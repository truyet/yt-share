export interface Post {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  likeCount: number;
  dislikeCount: number;
  authorId: number;
  author: {id: number, email: string};
  userInteraction: string;
  thumbnails: string;

}