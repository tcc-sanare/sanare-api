import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ChronicDisease,
  ChronicDiseaseProps,
} from '@/domain/medical/enterprise/entities/chronic-disease';
import { faker } from '@faker-js/faker';

export function makeChronicDisease(
  override: Partial<ChronicDiseaseProps> = {},
  id?: UniqueEntityID,
) {
  const chronicDisease = ChronicDisease.create(
    {
      name: faker.lorem.words({ min: 1, max: 3 }),
      description: faker.lorem.paragraph(),
      iconKey: null,
      ...override,
    },
    id,
  );

  return chronicDisease;
}
