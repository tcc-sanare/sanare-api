import { AccountRepository } from "@/domain/account/user/application/repositories/account-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { PrismaAccountMapper } from "../../mappers/account/prisma-account-mapper";

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor (
    private readonly prisma: PrismaService,
  ) {}

  async create(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account);

    await this.prisma.users.create({
      data,
    });
  }

  async save(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account);

    await this.prisma.users.update({
      where: {
        id: account.id.toString(),
      },
      data,
    });
  }

  async delete(account: Account): Promise<void> {
    await this.prisma.users.update({
      where: {
        id: account.id.toString(),
      },
      data: {
        status: "DELETED"
      },
    })
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.users.findUnique({
      where: {
        id,
        status: "ACTIVED",
      },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.prisma.users.findFirst({
      where: {
        email,
        status: "ACTIVED",
      },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }
}
