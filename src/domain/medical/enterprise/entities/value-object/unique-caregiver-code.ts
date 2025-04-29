import { UniqueCode } from "@/core/entities/unique-code";

export class UniqueCaregiverCode extends UniqueCode {

  constructor(value?: string) {
    super({ length: 10, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' }, value);
  }
}
