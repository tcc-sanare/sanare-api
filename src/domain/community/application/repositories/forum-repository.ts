import { Forum } from '../../enterprise/entities/forum';
import { Post } from '../../enterprise/entities/post';

export abstract class ForumRepository {
  abstract create(forum: Forum): Promise<void>;
  abstract delete(forum: Forum): Promise<void>;
  abstract save(forum: Forum): Promise<void>;
  abstract findById(id: string): Promise<Forum | null>;
  abstract findAll(): Promise<Forum[]>;
  // abstract findForumPosts(forumId: string): <Promise
}
