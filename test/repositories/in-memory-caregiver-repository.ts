import { CaregiverRepository } from "@/domain/medical/application/repositories/caregiver-repository";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";

export class InMemoryCaregiverRepository implements CaregiverRepository {
  items: Caregiver[];

  constructor () {
    this.items = [];
  }

  async create (caregiver: Caregiver): Promise<void> {
    this.items.push(caregiver);
  }

  async findById (id: string): Promise<Caregiver | null> {
    const caregiver = this.items.find((item) => item.id.toString() === id);

    return caregiver ?? null;
  }

  async findByUserId (userId: string): Promise<Caregiver | null> {
    const caregiver = this.items.find((item) => item.userId.toString() === userId);

    return caregiver ?? null;
  }

  async findByCaregiverCode (caregiverCode: UniqueCaregiverCode): Promise<Caregiver | null> {
    const caregiver = this.items.find((item) => item.code.toValue() === caregiverCode.toValue());

    return caregiver ?? null;
  }

  async save (caregiver: Caregiver): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === caregiver.id.toString());

    if (index !== -1) {
      this.items[index] = caregiver;
    }
  }

  async delete (caregiver: Caregiver): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === caregiver.id.toString());

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}