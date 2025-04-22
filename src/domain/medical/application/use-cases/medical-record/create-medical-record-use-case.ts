import { Either, left, right } from '@/core/either';
import {
  BloodType,
  MedicalRecord,
} from '@/domain/medical/enterprise/entities/medical-record';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import { Injectable } from '@nestjs/common';
import { MedicalRecordAllergy } from '@/domain/medical/enterprise/entities/medical-record-allergy';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MedicalRecordChronicDisease } from '@/domain/medical/enterprise/entities/medical-record-chronic-disease';
import { MedicalRecordAllergyList } from '@/domain/medical/enterprise/entities/medical-record-allergy-list';
import { MedicalRecordChronicDiseaseList } from '@/domain/medical/enterprise/entities/medical-record-chronic-disease-list';

interface CreateMedicalRecordUseCaseRequest {
  bloodType: BloodType;
  selfMonitorId: string;
  allergies: string[];
  chronicDiseases: string[];
}

type CreateMedicalRecordUseCaseResponse = Either<
  null,
  {
    medicalRecord: MedicalRecord;
  }
>;

@Injectable()
export class CreateMedicalRecordUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    data: CreateMedicalRecordUseCaseRequest,
  ): Promise<CreateMedicalRecordUseCaseResponse> {
    const medicalRecord = MedicalRecord.create({
      bloodType: data.bloodType,
      selfMonitorId: new UniqueEntityID(data.selfMonitorId),
    });

    try {
      const userMedicalRecord = await this.medicalRecordRepository.findBySelfMonitorId(
        data.selfMonitorId,
      );

      if (userMedicalRecord) {
        return left(null);
      }

      const medicalRecordAllergies = data.allergies.map((allergy) =>
        MedicalRecordAllergy.create({
          medicalRecordId: medicalRecord.id,
          allergyId: new UniqueEntityID(allergy),
        }),
      );

      const medicalRecordChronicDiseases = data.chronicDiseases.map(
        (chronicDisease) =>
          MedicalRecordChronicDisease.create({
            medicalRecordId: medicalRecord.id,
            chronicDiseaseId: new UniqueEntityID(chronicDisease),
          }),
      );

      medicalRecord.allergies = new MedicalRecordAllergyList(
        medicalRecordAllergies,
      );
      medicalRecord.chronicDiseases = new MedicalRecordChronicDiseaseList(
        medicalRecordChronicDiseases,
      );

      await this.medicalRecordRepository.create(medicalRecord);

      return right({ medicalRecord });
    } catch {
      return left(null);
    }
  }
}
