import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Forum, ForumProps } from "@/domain/community/enterprise/entities/forum";
import { faker } from "@faker-js/faker";

export function makeForum(
  override: Partial<ForumProps> = {},
  id?: UniqueEntityID,
) {
  const forum = Forum.create(
    {
      body: faker.company.name(),
      link: faker.internet.url(),
      imageKey: null,
      posts: [],
      ...override,
    },
    id,
  );

  return forum;
}