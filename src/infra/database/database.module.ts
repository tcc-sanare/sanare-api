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
import { MedicalRecordRepository } from '@/domain/medical/application/repositories/medical-record-repository';
import { PrismaMedicalRecordRepository } from './prisma/repositories/medical/prisma-medical-record-repository';
import { GoogleDrive } from '../storage/google-drive';
import { Storage } from '@/domain/application/storage';
import { SymptomRepository } from '@/domain/medical/application/repositories/symptom-repository';
import { PrismaSymptomRepository } from './prisma/repositories/medical/prisma-symptom-repository';
import { DiseaseRepository } from '@/domain/medical/application/repositories/disease-repository';
import { MedicalLogRepository } from '@/domain/medical/application/repositories/medical-log-repository';
import { PrismaDiseaseRepository } from './prisma/repositories/medical/prisma-disease-repository';
import { PrismaMedicalLogRepository } from './prisma/repositories/medical/prisma-medical-log-repository';
import { CaregiverRequestRepository } from '@/domain/medical/application/repositories/caregiver-request-repository';
import { PrismaCaregiverRequestRepository } from './prisma/repositories/medical/prisma-caregiver-request-repository';

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
      {
        provide: MedicalRecordRepository,
        useClass: PrismaMedicalRecordRepository
      },
      {
        provide: SymptomRepository,
        useClass: PrismaSymptomRepository
      },
      {
        provide: DiseaseRepository,
        useClass: PrismaDiseaseRepository
      },
      {
        provide: MedicalLogRepository,
        useClass: PrismaMedicalLogRepository,
      },
      {
        provide: CaregiverRequestRepository,
        useClass: PrismaCaregiverRequestRepository
      },
    // User
      {
        provide: AccountRepository,
        useClass: PrismaAccountRepository
      },
      {
        provide: Storage,
        useClass: GoogleDrive
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
    CaregiverRepository,
    MedicalRecordRepository,
    SymptomRepository,
    DiseaseRepository,
    MedicalLogRepository,
    CaregiverRequestRepository
  ],
})
export class DatabaseModule {}
