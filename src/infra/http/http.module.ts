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
import { CreateSelfMonitorController } from './controllers/self-monitor/create-self-monitor-controller';
import { GetSelfMonitorController } from './controllers/self-monitor/get-self-monitor-controller';
import { GetSelfMonitorByAccountIdUseCase } from '@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case';

@Module({
  controllers: [
    // Medical
      // Allergy
        GetAllAllergiesController,
        GetAllergyByIdController,
        CreateAllergyController,
      // ChronicDisease
        GetChronicDiseasesController,
        GetChronicDiseaseById,
        CreateChronicDiseaseController,
    // User
      // Account
        CreateAccountController,
        AuthenticateAccountController,
        GetAccountController,

      //Self Monitor
        CreateSelfMonitorController,
        GetSelfMonitorController
  ],
  providers: [
    // Medical
      // Allergy
        GetAllAllergiesUseCase,
        GetAllergiesByNameUseCase,
        GetAllergyByIdUseCase,
        CreateAllergyUseCase,
      // ChronicDisease
        GetAllChronicDiseasesUseCase,
        GetChronicDiseasesByNameUseCase,
        GetChronicDiseaseByIdUseCase,
        CreateChronicDiseaseUseCase,
      // Self Monitor
        CreateSelfMonitorUseCase,
        GetSelfMonitorByAccountIdUseCase,
    // User
      // Account
        CreateAccountUseCase,
        AuthenticateAccountUseCase,
        GetMyAccountUseCase,


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
    }
  ],
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secretOrPrivateKey: process.env.JWT_SECRET
    })
  ],
})
export class HttpModule {}
