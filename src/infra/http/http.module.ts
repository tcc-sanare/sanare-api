import { Module } from '@nestjs/common';
import { GetAllAllergiesController } from './controllers/medical/allergy/get-all-allergies-controller';
import { DatabaseModule } from '../database/database.module';
import { GetAllAllergiesUseCase } from '@/domain/medical/application/use-cases/allergy/get-all-allergies-use-case';
import { GetAllergyByIdController } from './controllers/medical/allergy/get-allergy-by-id-controller';
import { GetAllergyByIdUseCase } from '@/domain/medical/application/use-cases/allergy/get-allergy-by-id-use-case';
import { GetAllergiesByNameUseCase } from '@/domain/medical/application/use-cases/allergy/get-allergies-by-name-use-case';
import { CreateAllergyController } from './controllers/medical/allergy/create-allergy-controller';
import { CreateAllergyUseCase } from '@/domain/medical/application/use-cases/allergy/create-allergy-use-case';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { Storage } from '@/domain/application/storage';
import { GetChronicDiseasesController } from './controllers/medical/chronic-disease/get-all-chronic-diseases-controller';
import { GetAllChronicDiseasesUseCase } from '@/domain/medical/application/use-cases/chronic-disease/get-all-chronic-diseases-use-case';
import { GetChronicDiseasesByNameUseCase } from '@/domain/medical/application/use-cases/chronic-disease/get-chronic-diseases-by-name-use-case';
import { GetChronicDiseaseById } from './controllers/medical/chronic-disease/get-chronic-disease-by-id-controller';
import { GetChronicDiseaseByIdUseCase } from '@/domain/medical/application/use-cases/chronic-disease/get-chronic-disease-by-id-use-case';
import { CreateChronicDiseaseController } from './controllers/medical/chronic-disease/create-chronic-disease-controller';
import { CreateChronicDiseaseUseCase } from '@/domain/medical/application/use-cases/chronic-disease/create-chronic-disease-use-case';
import { CreateAccountController } from './controllers/account/user/create-account-controller';
import { CreateAccountUseCase } from '@/domain/account/user/application/use-cases/account/create-account-use-case';
import { Encrypter } from '@/domain/account/cryptography/encrypter';
import { JwtEncrypter } from '../cryptography/jwt-encrypter';
import { HashGenerator } from '@/domain/account/cryptography/hash-generetor';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { HashComparer } from '@/domain/account/cryptography/hash-comparer';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateAccountController } from './controllers/account/user/authenticate-account-controller';
import { AuthenticateAccountUseCase } from '@/domain/account/user/application/use-cases/account/authenticate-account-use-case';
import { GetAccountController } from './controllers/account/user/get-account-controller';
import { GetMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/get-my-account-use-case';
import { CreateSelfMonitorUseCase } from '@/domain/medical/application/use-cases/self-monitor/create-self-monitor-use-case';
import { CreateSelfMonitorController } from './controllers/medical/self-monitor/create-self-monitor-controller';
import { GetSelfMonitorController } from './controllers/medical/self-monitor/get-self-monitor-controller';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';
import { GoogleDrive } from '../storage/google-drive';
import { UpdateProfilePhotoAccountController } from './controllers/account/user/update-profile-photo-account-controller';
import { UpdateMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/update-my-account-use-case';
import { CreateCaregiverController } from './controllers/medical/caregiver/create-caregiver-controller';
import { CreateCaregiverUseCase } from '@/domain/medical/application/use-cases/caregiver/create-caregiver-use-case';
import { GetCaregiverByUserIdController } from './controllers/medical/caregiver/get-caregiver-by-id-controller';
import { GetCaregiverByUserIdUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case';
import { GetSelfMonitorByCaregiverIdController } from './controllers/medical/caregiver/get-self-monitor-by-caregiver-controller';
import { GetSelfMonitorsByCaregiverIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitors-by-caregiver-id-use-case';
import { GetCaregiverByCaregiverCodeUseCase } from '@/domain/medical/application/use-cases/caregiver/get-caregiver-by-caregiver-code-use-case';
import { ConnectCaregiverToSelfMonitorController } from './controllers/medical/self-monitor/connect-caregiver-to-self-monitor-controller';
import { UpdateSelfMonitorUseCase } from '@/domain/medical/application/use-cases/self-monitor/update-self-monitor-use-case';
import { CreateMedicalRecordUseCase } from '@/domain/medical/application/use-cases/medical-record/create-medical-record-use-case';
import { CreateaMedicalRecordController } from './controllers/medical/medical-record/create-medical-record-controller';
import { GetMedicalRecordBySelfMonitorIdUseCase } from '@/domain/medical/application/use-cases/medical-record/get-medical-record-by-self-monitor-id';
import { GetMedicalRecordController } from './controllers/medical/medical-record/get-medical-record-controller';
import { UpdateMedicalRecordController } from './controllers/medical/medical-record/update-medical-record-controller';
import { UpdateMedicalRecordUseCase } from '@/domain/medical/application/use-cases/medical-record/update-medical-record-use-case';
import { DeleteAllergyController } from './controllers/medical/allergy/delete-allergy-controller';
import { DeleteAllergyUseCase } from '@/domain/medical/application/use-cases/allergy/delete-allergy-use-case';
import { DeleteChronicDiseaseUseCase } from '@/domain/medical/application/use-cases/chronic-disease/delete-chronic-disease-use-case';
import { DeleteChronicDiseaseController } from './controllers/medical/chronic-disease/delete-chronic-disease-controller';
import { UpdateChronicDiseaseController } from './controllers/medical/chronic-disease/update-chronic-disease-controller';
import { UpdateChronicDiseaseUseCase } from '@/domain/medical/application/use-cases/chronic-disease/update-chronic-disease-use-case';
import { MulterModule } from '@nestjs/platform-express';
import { UpdateSelfMonitorController } from './controllers/medical/self-monitor/update-self-monitor-controller';

@Module({
  controllers: [
    // Medical
      // Allergy
        GetAllAllergiesController,
        GetAllergyByIdController,
        CreateAllergyController,
        DeleteAllergyController,
      // ChronicDisease
        GetChronicDiseasesController,
        GetChronicDiseaseById,
        CreateChronicDiseaseController,
        DeleteChronicDiseaseController,
        UpdateChronicDiseaseController,
    // User
      // Account
        CreateAccountController,
        AuthenticateAccountController,
        GetAccountController,
        UpdateProfilePhotoAccountController,
      //Self Monitor
        CreateSelfMonitorController,
        GetSelfMonitorController,
        GetSelfMonitorByCaregiverIdController,
        ConnectCaregiverToSelfMonitorController,
        UpdateSelfMonitorController,
      //Caregiver
        CreateCaregiverController,
        GetCaregiverByUserIdController,
      //MedicalRecord
        CreateaMedicalRecordController,
        GetMedicalRecordController,
        UpdateMedicalRecordController,
  ],
  providers: [
    // Medical
      // Allergy
        GetAllAllergiesUseCase,
        GetAllergiesByNameUseCase,
        GetAllergyByIdUseCase,
        CreateAllergyUseCase,
        DeleteAllergyUseCase,
      // ChronicDisease
        GetAllChronicDiseasesUseCase,
        GetChronicDiseasesByNameUseCase,
        GetChronicDiseaseByIdUseCase,
        CreateChronicDiseaseUseCase,
        DeleteChronicDiseaseUseCase,
        UpdateChronicDiseaseUseCase,
      // Self Monitor
        CreateSelfMonitorUseCase,
        GetSelfMonitorByAccountIdUseCase,
        GetSelfMonitorsByCaregiverIdUseCase,
        UpdateSelfMonitorUseCase,
      //Caregiver
        CreateCaregiverUseCase,
        GetCaregiverByUserIdUseCase,
        GetCaregiverByCaregiverCodeUseCase,
      //MedicalRecord
        CreateMedicalRecordUseCase,
        GetMedicalRecordBySelfMonitorIdUseCase,
        UpdateMedicalRecordUseCase,
    // User
      // Account
        CreateAccountUseCase,
        AuthenticateAccountUseCase,
        GetMyAccountUseCase,
        UpdateMyAccountUseCase,

    {
      provide: Storage,
      useClass: InMemoryStorage
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher
    },
    {
      provide: Storage,
      useClass: GoogleDrive
    }
  ],
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    }),
    MulterModule.register()
  ],
})
export class HttpModule {}
