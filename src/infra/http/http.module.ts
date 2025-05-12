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

@Module({
  controllers: [
    GetAllAllergiesController,
    GetAllergyByIdController,
    CreateAllergyController
  ],
  providers: [
    GetAllAllergiesUseCase,
    GetAllergiesByNameUseCase,
    GetAllergyByIdUseCase,
    CreateAllergyUseCase,
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
