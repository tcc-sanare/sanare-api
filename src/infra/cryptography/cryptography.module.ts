import { HashGenerator } from '@/domain/account/cryptography/hash-generetor';
import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { HashComparer } from '@/domain/account/cryptography/hash-comparer';
@Module({
  imports: [],
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
