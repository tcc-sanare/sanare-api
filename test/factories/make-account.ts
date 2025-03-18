import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account, AccountProps } from "@/domain/account/enterprise/entities/account";
import { faker } from "@faker-js/faker";

export function makeAccount (
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID
) {
  const account = Account.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override
  });

  return account;
}