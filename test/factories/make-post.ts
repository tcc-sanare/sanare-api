import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Post, PostProps } from "@/domain/community/enterprise/entities/post";
import { faker } from "@faker-js/faker";

export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityID
) {
  const post = Post.create({
    body: faker.lorem.paragraph(),
    userId: new UniqueEntityID().toString(),
    forumId: new UniqueEntityID().toString(),

    childPosts: [],
    notes: [],
    saves: []
  }, id);

  return post;
}