import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AllergyRepository } from '@/domain/medical/application/repositories/allergy-repository';
import { PrismaAllergyRepository } from './prisma/repositories/medical/prisma-allergy-repository';
import { ChronicDiseaseRepository } from '@/domain/medical/application/repositories/chronic-disease-repository';
import { PrismaChronicDiseaseRepository } from './prisma/repositories/medical/prisma-chronic-disease-repository';
import { AccountRepository } from '@/domain/account/user/application/repositories/account-repository';
import { PrismaAccountRepository } from './prisma/repositories/account/prisma-account-repository';
import { SelfMonitorRepository } from '@/domain/medical/application/repositories/self-monitor-repository';
import { PrismaSelfMonitorRepository } from './prisma/repositories/medical/prisma-self-monitor-repository';
import { CaregiverRepository } from '@/domain/medical/application/repositories/caregiver-repository';
import { PrismaCaregiverRepository } from './prisma/repositories/medical/prisma-caregiver-repository';

@Module({
  providers: [
    PrismaService,
    // Medical
      {
        provide: AllergyRepository,
        useClass: PrismaAllergyRepository
      },
      {
        provide: ChronicDiseaseRepository,
        useClass: PrismaChronicDiseaseRepository
      },
      {
        provide: SelfMonitorRepository,
        useClass: PrismaSelfMonitorRepository
      },
      {
        provide: CaregiverRepository,
        useClass: PrismaCaregiverRepository
      },
    // User
      {
        provide: AccountRepository,
        useClass: PrismaAccountRepository
      }
  ],
  controllers: [],
  imports: [],
  exports: [
    PrismaService,
    AllergyRepository,
    ChronicDiseaseRepository,
    SelfMonitorRepository,
    AccountRepository,
    CaregiverRepository
  ],
})
export class DatabaseModule {}
