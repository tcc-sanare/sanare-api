import { ChronicDiseaseRepository } from '@/domain/medical/application/repositories/chronic-disease-repository';
import { ChronicDisease } from '@/domain/medical/enterprise/entities/chronic-disease';

export class InMemoryChronicDiseaseRepository
  implements ChronicDiseaseRepository
{
  items: ChronicDisease[];

  constructor() {
    this.items = [];
  }

  async create(chronicDisease: ChronicDisease): Promise<void> {
    this.items.push(chronicDisease);
  }

  async findAll(): Promise<ChronicDisease[]> {
    return this.items;
  }

  async save(chronicDisease: ChronicDisease): Promise<void> {
    const index = this.items.findIndex((item) => item.id === chronicDisease.id);

    if (index === -1) {
      throw new Error('Chronic Disease not found');
    }

    this.items[index] = chronicDisease;
  }

  async delete(chronicDisease: ChronicDisease): Promise<void> {
    const index = this.items.findIndex((item) => item.id === chronicDisease.id);

    if (index === -1) {
      throw new Error('Chronic Disease not found');
    }

    this.items.splice(index, 1);
  }

  async findById(id: string): Promise<ChronicDisease | null> {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async findByName(name: string): Promise<ChronicDisease[] | null> {
    return (
      this.items.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      ) || null
    );
  }
}
