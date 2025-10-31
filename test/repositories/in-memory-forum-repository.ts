import { ForumRepository } from "@/domain/community/application/repositories/forum-repository";
import { Forum } from "@/domain/community/enterprise/entities/forum";
import { Post } from "@/domain/community/enterprise/entities/post";

export class InMemoryForumRepository implements ForumRepository {
  public items: Forum[]

  constructor() {
    this.items = []
  }

  async create(forum: Forum): Promise<void> {
    this.items.push(forum)
  }

  async delete(forum: Forum): Promise<void> {
    const forumIndex = this.items.findIndex(item => item.id.toString() === forum.id.toString())

    if (forumIndex === -1) {
      throw new Error('Forum not found')
    }

    this.items.splice(forumIndex, 1)
  }

  async save(forum: Forum): Promise<void> {
    const forumIndex = this.items.findIndex(item => item.id.toString() === forum.id.toString())

    if (forumIndex) {
      throw new Error('Forum not found')
    }
    this.items[forumIndex] = forum
  }

  async findById(id: string): Promise<Forum | null> {
    return this.items.find(item => item.id.toString() === id) || null
  }

  async findAll(): Promise<Forum[]> {
    return this.items
  }
}

  // async findAllPosts(id: string): Promise<Post[]> {
  //   const forum = this.items.find(item => item.id.toString() === id) || null

  //   if (!forum) {
  //     throw new Error('Forum not found')
  //   }

  //   return forum.posts
  // }

  // async findByName(name: string): Promise<Forum[] | null> {
  //   const forum = this.items.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()))

  //   return forum;
  // }