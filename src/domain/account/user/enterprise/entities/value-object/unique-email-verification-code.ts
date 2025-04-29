import { UniqueCode } from "@/core/entities/unique-code";

export class UniqueEmailVerificationCode extends UniqueCode {
  constructor(value?: string) {
    super({ length: 4, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' }, value);
  }
}