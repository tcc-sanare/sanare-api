import { Either, left, right } from "@/core/either";
import { BloodType, MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";
import { MedicalRecordRepository } from "../../repositories/medical-record-repository";
import { Injectable } from "@nestjs/common";
import { AllergyRepository } from "../../repositories/allergy-repository";
import { MedicalRecordAllergiesRepository } from "../../repositories/medical-record-allergy-repository";
import { MedicalRecordChronicDiseasesRepository } from "../../repositories/medical-record-chronic-disease";
import { MedicalRecordAllergy } from "@/domain/medical/enterprise/entities/medical-record-allergy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ChronicDisease } from "@/domain/medical/enterprise/entities/chronic-disease";
import { MedicalRecordChronicDisease } from "@/domain/medical/enterprise/entities/medical-record-chronic-disease";

interface CreateMedicalRecordUseCaseRequest {
  bloodType: BloodType;
  userId: string;
  allergies: string[];
  chronicDiseases: string[];

}

type CreateMedicalRecordUseCaseResponse = Either<
  null,
  {
    medicalRecord: MedicalRecord
  }
>;

@Injectable()
export class CreateMedicalRecordUseCase {
  constructor(
    private medicalRecordRepository: MedicalRecordRepository,
    private medicalRecordAllergiesRepository: MedicalRecordAllergiesRepository,
    private medicalRecordChronicDiseasesRepository: MedicalRecordChronicDiseasesRepository
  ) {}

  async execute (
    data: CreateMedicalRecordUseCaseRequest
  ): Promise<CreateMedicalRecordUseCaseResponse> {
    const medicalRecord = MedicalRecord.create({
      bloodType: data.bloodType,
      userId: data.userId
    });

    try {
      await this.medicalRecordRepository.create(medicalRecord);

      const medicalRecordAllergies = data.allergies
        .map(allergy => MedicalRecordAllergy.create({
          medicalRecordId: medicalRecord.id,
          allergyId: new UniqueEntityID(allergy)
        }));

      await this.medicalRecordAllergiesRepository.createMany(medicalRecordAllergies);

      const medicalRecordChronicDiseases = data.chronicDiseases
        .map(chronicDisease => MedicalRecordChronicDisease.create({
          medicalRecordId: medicalRecord.id,
          chronicDiseaseId: new UniqueEntityID(chronicDisease)
        }));

      await this.medicalRecordChronicDiseasesRepository.createMany(medicalRecordChronicDiseases);

      return right({medicalRecord});
    } catch {
      return left(null);
    }
  }
}