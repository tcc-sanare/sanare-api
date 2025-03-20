import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Allergy,
  AllergyProps,
} from '@/domain/medical/enterprise/entities/allergy';
import { faker } from '@faker-js/faker';

export function makeAllergy(
  override: Partial<AllergyProps> = {},
  id?: UniqueEntityID,
) {
  const allergy = Allergy.create(
    {
      name: faker.lorem.words({ min: 1, max: 3 }),
      description: faker.lorem.paragraph(),
      ...override,
    },
    id,
  );

  return allergy;
}
