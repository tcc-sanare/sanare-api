import { UniqueCode } from "@/core/entities/unique-code";

export class UniqueForgotPasswordCode extends UniqueCode {
  private static expireMinutes = 10;

  constructor(value?: string) {
    super({ length: 4, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' }, value);
  }

  static getExpireMinutes () {
    return this.expireMinutes;
  }
}