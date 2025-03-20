import { Allergy } from '../../enterprise/entities/allergy';

export abstract class AllergyRepository {
  abstract save(allergy: Allergy): Promise<void>;
  abstract delete(allergy: Allergy): Promise<void>;
  abstract findById(id: string): Promise<Allergy | null>;
  abstract findByName(name: string): Promise<Allergy[] | null>;
}
