import { Post } from "../../enterprise/entities/post";

export abstract class PostRepository {
  abstract create(post: Post): Promise<void>;
  abstract delete(post: Post): Promise<void>;
  abstract save(post: Post): Promise<void>;
  abstract findById(id: string): Promise<Post | null>;
  abstract findByForumId(forumId: string): Promise<Post[]>
}