import { Post } from "@/domain/community/enterprise/entities/post";

export class PostPresenter {
  static toHttp(post: Post) {
    const {
      id,
      body,
      status,
      userId,
      parentId,
      forumId,
      createdAt,
      updatedAt,
      childPosts,
      notes,
    } = post

    return {
      id: id.toString(),
      body,
      status,
      userId,
      parentId,
      forumId,
      createdAt,
      updatedAt,
      childPosts: childPosts.map(PostPresenter.toHttp),
      notes
    }
  }
}