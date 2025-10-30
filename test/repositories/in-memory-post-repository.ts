import { PostRepository } from "@/domain/community/application/repositories/post-repository";
import { Post } from "@/domain/community/enterprise/entities/post";

export class InMemoryPostRepository implements PostRepository {
  public items: Post[] = []

  async create(post: Post): Promise<void> {
    this.items.push(post)
  }

  async delete(post: Post): Promise<void> {
    const postIndex = this.items.findIndex(item => item.id.toString() === post.id.toString())

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    this.items.splice(postIndex, 1)
  }

  async save(post: Post): Promise<void> {
    const postIndex = this.items.findIndex(item => item.id.toString() === post.id.toString())

    if (postIndex === -1) {
      throw new Error('Post not found')
    }

    this.items[postIndex] = post
  }

  async findById(id: string): Promise<Post | null> {
    return this.items.find(item => item.id.toString() === id) || null
  }
  
  async findByForumId(forumId: string): Promise<Post[]> {
    return this.items.filter(item => item.forumId === forumId) || null
  }
}