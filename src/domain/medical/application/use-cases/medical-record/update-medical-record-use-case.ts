import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import {
  BloodType,
  MedicalRecord,
} from '@/domain/medical/enterprise/entities/medical-record';
import { MedicalRecordAllergy } from '@/domain/medical/enterprise/entities/medical-record-allergy';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MedicalRecordChronicDisease } from '@/domain/medical/enterprise/entities/medical-record-chronic-disease';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface UpdateMedicalRecordUseCaseRequest {
  medicalRecordId: string;
  bloodType?: BloodType;
  allergies?: string[];
  chronicDiseases?: string[];
}

type UpdateMedicalRecordUseCaseResponse = Either<
  NotAllowedError<UpdateMedicalRecordUseCaseRequest>,
  {
    medicalRecord: MedicalRecord;
  }
>;

@Injectable()
export class UpdateMedicalRecordUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    data: UpdateMedicalRecordUseCaseRequest,
  ): Promise<UpdateMedicalRecordUseCaseResponse> {
    const medicalRecord = await this.medicalRecordRepository.findById(
      data.medicalRecordId,
    );

    if (!medicalRecord) {
      return left(new NotAllowedError<UpdateMedicalRecordUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Prontuário médico não encontrado',
          },
        ],
      }));
    }

    if (data.bloodType) {
      medicalRecord.bloodType = data.bloodType;
    }

    if (data.allergies) {
      medicalRecord.allergies.update(
        data.allergies.map((allergy) =>
          MedicalRecordAllergy.create({
            medicalRecordId: medicalRecord.id,
            allergyId: new UniqueEntityID(allergy),
          }),
        ),
      );
    }

    if (data.chronicDiseases) {
      medicalRecord.chronicDiseases.update(
        data.chronicDiseases.map((chronicDisease) =>
          MedicalRecordChronicDisease.create({
            medicalRecordId: medicalRecord.id,
            chronicDiseaseId: new UniqueEntityID(chronicDisease),
          }),
        ),
      );
    }

    await this.medicalRecordRepository.save(medicalRecord);

    return right({ medicalRecord });
  }
}
