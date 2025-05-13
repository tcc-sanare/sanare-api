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
        CreateChronicDiseaseController
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
    {
      provide: Storage,
      useClass: InMemoryStorage
    }
  ],
  imports: [
    DatabaseModule
  ],
})
export class HttpModule {}
