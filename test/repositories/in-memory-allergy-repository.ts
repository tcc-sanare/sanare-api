import { AllergyRepository } from "@/domain/medical/application/repositories/allergy-repository";
import { Allergy } from "@/domain/medical/enterprise/entities/allergy";

export class InMemoryAllergyRepository implements AllergyRepository {
  items: Allergy[];

  constructor () {
    this.items = [];
  }

  async save(allergy: Allergy): Promise<void> {
    this.items.push(allergy);
  }

  async delete(allergy: Allergy): Promise<void> {
    const allergyIndex = this.items.findIndex(item => item.id === allergy.id);

    if (allergyIndex === -1) {
      throw new Error("allergy not found");
    }

    this.items.splice(allergyIndex, 1);
  }

  async findById(id: string): Promise<Allergy> {
    const allergy = this.items.find(allergy => allergy.id.toString() === id);

    return allergy;
  }

  async findByName(name: string): Promise<Allergy[]> {
    const allergies = this.items.filter(allergy => allergy.name.toLowerCase().includes(name));

    return allergies;
  }
  
}