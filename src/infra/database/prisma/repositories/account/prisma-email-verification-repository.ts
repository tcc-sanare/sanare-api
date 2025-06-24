import { EmailVerificationRepository } from "@/domain/account/user/application/repositories/email-verification-repository";
import { PrismaService } from "../../prisma.service";
import { EmailVerification } from "@/domain/account/user/enterprise/entities/email-verification";
import { UniqueEmailVerificationCode } from "@/domain/account/user/enterprise/entities/value-object/unique-email-verification-code";
import { PrismaEmailVerificationMapper } from "../../mappers/account/prisma-email-verification-mapper";

export class PrismaEmailVerificationRepository implements EmailVerificationRepository {
  constructor (
    private prisma: PrismaService
  ) {}
  
  async findById(id: string): Promise<EmailVerification | null> {
    const emailVerification = await this.prisma.verificationCodes.findUnique({
      where: {
        id,
        type: 'EMAIL'
      },
    });
    
    if (!emailVerification) {
      return null;
    }
    
    return PrismaEmailVerificationMapper.toDomain(emailVerification);
  }
  
  async findByUserId(userId: string): Promise<EmailVerification | null> {
    const emailVerification = await this.prisma.verificationCodes.findFirst({
      where: {
        userId,
        type: 'EMAIL',
      },
    });

    if (!emailVerification) {
      return null;
    }

    return PrismaEmailVerificationMapper.toDomain(emailVerification);
  }
  
  async findByCode(code: UniqueEmailVerificationCode): Promise<EmailVerification | null> {
    const emailVerification = await this.prisma.verificationCodes.findFirst({
      where: {
        code: code.toValue(),
        type: 'EMAIL',
      },
    });

    if (!emailVerification) {
      return null;
    }

    return PrismaEmailVerificationMapper.toDomain(emailVerification);
  }
  
  async create(emailVerification: EmailVerification): Promise<void> {
    const data = PrismaEmailVerificationMapper.toPrisma(emailVerification);
    
    await this.prisma.verificationCodes.create({
      data,
    });
  }
  
  async save(emailVerification: EmailVerification): Promise<void> {
    const data = PrismaEmailVerificationMapper.toPrisma(emailVerification);
    
    await this.prisma.verificationCodes.update({
      where: {
        id: emailVerification.id.toString(),
      },
      data,
    });
  }
  
  async delete(emailVerification: EmailVerification): Promise<void> {
    await this.prisma.verificationCodes.delete({
      where: {
        id: emailVerification.id.toString(),
      },
    });
  }

}