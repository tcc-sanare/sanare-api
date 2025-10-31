import { ForgotPasswordRepository } from "@/domain/account/user/application/repositories/forgot-password-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ForgotPassword } from "@/domain/account/user/enterprise/entities/forgot-password";
import { PrismaForgotPasswordMapper } from "../../mappers/account/prisma-forgot-password-mapper";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

@Injectable()
export class PrismaForgotPasswordRepository implements ForgotPasswordRepository {
  constructor (
    private prisma: PrismaService
  ) {};

  async create(forgotPassword: ForgotPassword): Promise<void> {
    const data = PrismaForgotPasswordMapper.toPrisma(forgotPassword);

    await this.prisma.verificationCodes.create({
      data
    });
  }

  async findByAccountId(accountId: UniqueEntityID): Promise<ForgotPassword | null> {
    const forgotPassword = await this.prisma.verificationCodes.findFirst({
      where: {
        userId: accountId.toString(),
        type: 'PASSWORD',
      }
    });

    if (!forgotPassword) {
      return null;
    }

    return PrismaForgotPasswordMapper.toDomain(forgotPassword);
  }

  async deleteByAccountId(accountId: UniqueEntityID): Promise<void> {
    await this.prisma.verificationCodes.deleteMany({
      where: {
        userId: accountId.toString(),
        type: 'PASSWORD',
      }
    });
  }
}