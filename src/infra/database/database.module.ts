import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AllergyRepository } from '@/domain/medical/application/repositories/allergy-repository';
import { PrismaAllergyRepository } from './prisma/repositories/medical/prisma-allergy-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AllergyRepository,
      useClass: PrismaAllergyRepository
    }
  ],
  controllers: [],
  imports: [],
  exports: [
    PrismaService,
    AllergyRepository
  ],
})
export class DatabaseModule {}
