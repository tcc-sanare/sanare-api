import {
  MedicalLog,
  MoodTypes,
} from '@/domain/medical/enterprise/entities/medical-log';
import { Injectable } from '@nestjs/common';
import { MedicalLogRepository } from '../../repositories/medical-log-repository';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { MedicalLogDisease } from '@/domain/medical/enterprise/entities/medical-log-disease';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MedicalLogSymptom } from '@/domain/medical/enterprise/entities/medical-log-symptom';

interface UpdateMedicalLogUseCaseRequest {
  medicalLogId: string;

  bloodPressure?: string;
  heartRate?: number;
  mood?: MoodTypes;
  hydratation?: number;
  bloodSugar?: number;

  diseases?: string[];
  symptoms?: string[];
}

type UpdateMedicalLogUseCaseResponse = Either<
  NotAllowedError<UpdateMedicalLogUseCaseRequest>,
  {
    medicalLog: MedicalLog;
  }
>;

@Injectable()
export class UpdateMedicalLogUseCase {
  constructor(private medicalLogRepository: MedicalLogRepository) {}

  async execute(
    request: UpdateMedicalLogUseCaseRequest,
  ): Promise<UpdateMedicalLogUseCaseResponse> {
    const medicalLog = await this.medicalLogRepository.findById(
      request.medicalLogId,
    );

    if (!medicalLog) {
      return left(
        new NotAllowedError<UpdateMedicalLogUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Registro médico não encontrado',
            },
          ],
        }),
      );
    }

    if (request.bloodPressure) {
      medicalLog.bloodPressure = request.bloodPressure;
    }

    if (request.bloodSugar) {
      medicalLog.bloodSugar = request.bloodSugar;
    }

    if (request.heartRate) {
      medicalLog.hearthRate = request.heartRate;
    }

    if (request.hydratation) {
      medicalLog.hydratation = request.hydratation;
    }

    if (request.mood) {
      medicalLog.mood = request.mood;
    }

    if (request.diseases) {
      medicalLog.diseases.update(
        request.diseases.map((disease) =>
          MedicalLogDisease.create({
            medicalLogId: medicalLog.id,
            diseaseId: new UniqueEntityID(disease),
          }),
        ),
      );
    }

    if (request.symptoms) {
      medicalLog.symptoms.update(
        request.symptoms.map((symptom) =>
          MedicalLogSymptom.create({
            medicalLogId: medicalLog.id,
            symptomId: new UniqueEntityID(symptom),
          }),
        ),
      );
    }

    await this.medicalLogRepository.save(medicalLog);

    return right({ medicalLog });
  }
}
