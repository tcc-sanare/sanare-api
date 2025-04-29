import { HashComparer } from '@/domain/account/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/account/cryptography/hash-generetor';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain + '-hashed';
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain + '-hashed' === hash;
  }
}
