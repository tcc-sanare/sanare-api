import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { Prisma, Users as PrismaAccount } from "@prisma/client";

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount): Account {
    return Account.create({
      email: raw.email,
      name: raw.name,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isVerified: raw.isVerified,
      profilePhotoKey: raw.profilePhotoKey,
      theme: raw.theme,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(account: Account): Prisma.UsersUncheckedCreateInput {
    return {
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      password: account.password,
      isVerified: account.isVerified,
      profilePhotoKey: account.profilePhotoKey,
      theme: account.theme,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}