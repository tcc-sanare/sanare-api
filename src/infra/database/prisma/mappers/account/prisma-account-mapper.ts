import { StoragedFile } from "@/core/entities/storaged-file";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { Prisma, Users as PrismaAccount } from "@prisma/client";
import { Storage } from "@/domain/application/storage";

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount, storage: Storage): Account {
    return Account.create({
      email: raw.email,
      name: raw.name,
      password: raw.password,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isVerified: raw.isVerified,
      profilePhoto: raw.profilePhotoKey ? 
        new StoragedFile(raw.profilePhotoKey, storage) :
        null,
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
      profilePhotoKey: account.profilePhoto?.key || null,
      theme: account.theme,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}