import { Forum } from "@/domain/community/enterprise/entities/forum";
import { PostPresenter } from "./post-presenter";

export class ForumPresenter {
  static toHttp(forum: Forum) {
    const {
      id,
      body,
      link,
      imageKey,
      status,
      posts,
      createdAt,
      saves,
    } = forum

    return {
      id: id.toString(),
      body,
      link,
      imageKey,
      saves: saves.currentItems.map(save => {
        return {
          forumId: save.forumId,
          userId: save.userId
        }
      }),
      status,
      posts: posts.map(PostPresenter.toHttp),
      createdAt
    }
  }
}