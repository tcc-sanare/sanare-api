import { Allergy } from "@/domain/medical/enterprise/entities/allergy";

export interface AllergyHttp {
  id: string;
  name: string;
  description: string;
  iconKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AllergyPresenter {
  static toHttp(allergy: Allergy) {
    return {
      id: allergy.id.toString(),
      name: allergy.name,
      type: allergy.type,
      createdAt: allergy.createdAt,
      updatedAt: allergy.updatedAt,
    };
  }
}