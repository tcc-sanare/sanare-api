import { HashComparer } from "@/domain/account/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/account/cryptography/hash-generetor";
import bcrypt from "bcryptjs";

export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 8);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }
}