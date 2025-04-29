import { Encrypter } from "@/domain/account/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
  async encrypt(data: any): Promise<string> {
    return JSON.stringify(data);
  }

  async decrypt(token: string): Promise<any> {
    return JSON.parse(token);
  }
}