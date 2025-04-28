function createCaregiverCode() {
  let code: string = '';

  for (let i = 0; i < 10; i++) {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    code += chars[Math.floor(Math.random() * chars.length)].toUpperCase();
  }

  return code;
}

export class UniqueCaregiverCode {
  private value: string;

  constructor(value?: string) {
    this.value = value ?? createCaregiverCode();
  }

  toValue() {
    return this.value;
  }
}
