import { EmailVerificationRepository } from "@/domain/account/user/application/repositories/email-verification-repository";
import { EmailVerification } from "@/domain/account/user/enterprise/entities/email-verification";
import { UniqueEmailVerificationCode } from "@/domain/account/user/enterprise/entities/value-object/unique-email-verification-code";

export class InMemoryEmailVerificationRepository implements EmailVerificationRepository {
  items: EmailVerification[];

  constructor() {
    this.items = [];
  }

  
  async findById(id: string): Promise<EmailVerification | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null;
  }
  
  async findByUserId(userId: string): Promise<EmailVerification | null> {
    return this.items.find((item) => item.userId.toString() === userId) ?? null;
  }
  
  async findByCode(code: UniqueEmailVerificationCode): Promise<EmailVerification | null> {
    return this.items.find((item) => item.code.toValue() === code.toValue()) ?? null;
  }
  
  async create(emailVerification: EmailVerification): Promise<void> {
    this.items.push(emailVerification);
  }
  
  async save(emailVerification: EmailVerification): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === emailVerification.id.toString());

    if (index !== -1) {
      this.items[index] = emailVerification;
    }
  }
  
  async delete(emailVerification: EmailVerification): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === emailVerification.id.toString());

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
  
}