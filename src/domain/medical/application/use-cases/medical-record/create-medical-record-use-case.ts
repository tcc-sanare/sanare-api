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
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface CreateMedicalRecordUseCaseRequest {
  bloodType: BloodType;
  selfMonitorId: string;
  allergies: {
    allergyId: string;
    description?: string;
  }[];
  chronicDiseases: string[];
}

type CreateMedicalRecordUseCaseResponse = Either<
  NotAllowedError<CreateMedicalRecordUseCaseRequest>,
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

    const userMedicalRecord = await this.medicalRecordRepository.findBySelfMonitorId(
      data.selfMonitorId,
    );

    if (userMedicalRecord) {
      return left(new NotAllowedError<CreateMedicalRecordUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Já existe um prontuário médico para este usuário',
          },
        ],
      }));
    }

    const medicalRecordAllergies = data.allergies.map((allergy) =>
      MedicalRecordAllergy.create({
        medicalRecordId: medicalRecord.id,
        allergyId: new UniqueEntityID(allergy.allergyId),
        description: allergy.description
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
  
  }
}
