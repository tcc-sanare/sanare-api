import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account, AccountProps } from "@/domain/account/user/enterprise/entities/account";
import { faker } from "@faker-js/faker";

export function makeAccount (
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID
) {
  const account = Account.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    profilePhotoKey: null,
    isVerified: false,
    theme: 'LIGHT',
    ...override
  });

  return account;
}