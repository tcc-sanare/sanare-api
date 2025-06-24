import { ChronicDisease } from "@/domain/medical/enterprise/entities/chronic-disease";

export interface ChronicDiseaseHttp {
  id: string;
  name: string;
  description: string;
  iconKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChronicDiseasePresenter {
  static toHttp(chronicDisease: ChronicDisease) {
    return {
      id: chronicDisease.id.toString(),
      name: chronicDisease.name,
      description: chronicDisease.description,
      iconKey: chronicDisease.iconKey,
      createdAt: chronicDisease.createdAt,
      updatedAt: chronicDisease.updatedAt,
    };
  }
}