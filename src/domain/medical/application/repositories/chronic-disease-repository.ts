import { ChronicDisease } from '../../enterprise/entities/chronic-disease';

export abstract class ChronicDiseaseRepository {
  abstract create(chronicDisease: ChronicDisease): Promise<void>;
  abstract findAll(): Promise<ChronicDisease[]>;
  abstract save(chronicDisease: ChronicDisease): Promise<void>;
  abstract delete(chronicDisease: ChronicDisease): Promise<void>;
  abstract findById(id: string): Promise<ChronicDisease | null>;
  abstract findByName(name: string): Promise<ChronicDisease[] | null>;
}
