import { Either, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import {
  MedicalLog,
  MoodTypes,
} from '@/domain/medical/enterprise/entities/medical-log';
import { Injectable } from '@nestjs/common';
import { MedicalLogRepository } from '../../repositories/medical-log-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { MedicalLogDisease } from '@/domain/medical/enterprise/entities/medical-log-disease';
import { MedicalLogSymptom } from '@/domain/medical/enterprise/entities/medical-log-symptom';
import { MedicalLogDiseaseList } from '@/domain/medical/enterprise/entities/medical-log-disease-list';
import { MedicalLogSymptomList } from '@/domain/medical/enterprise/entities/medical-log-symptom-list';

interface CreateMedicalLogUseCaseRequest {
  selfMonitorId: string;
  bloodPressure?: string;
  heartRate?: number;
  mood?: MoodTypes;
  hydratation?: number;
  bloodSugar?: number;

  diseases: string[];
  symptoms: string[];
}

type CreateMedicalLogUseCaseResponse = Either<
  NotAllowedError<CreateMedicalLogUseCaseRequest>,
  {
    medicalLog: MedicalLog;
  }
>;

@Injectable()
export class CreateMedicalLogUseCase {
  constructor(private medicalLogRepository: MedicalLogRepository) {}

  async execute(
    request: CreateMedicalLogUseCaseRequest,
  ): Promise<CreateMedicalLogUseCaseResponse> {
    const medicalLog = MedicalLog.create({
      bloodPressure: request.bloodPressure,
      heartRate: request.heartRate,
      mood: request.mood,
      hydratation: request.hydratation,
      bloodSugar: request.bloodSugar,
      selfMonitorId: new UniqueEntityID(request.selfMonitorId),
    });

    const medicalLogDiseases = request.diseases?.map((disease) =>
      MedicalLogDisease.create({
        medicalLogId: medicalLog.id,
        diseaseId: new UniqueEntityID(disease),
      }),
    );
    
    medicalLog.diseases = new MedicalLogDiseaseList(medicalLogDiseases);
    

    const medicalLogSymptoms = request.symptoms?.map((symptom) =>
      MedicalLogSymptom.create({
        medicalLogId: medicalLog.id,
        symptomId: new UniqueEntityID(symptom),
      }),
    );

    medicalLog.symptoms = new MedicalLogSymptomList(medicalLogSymptoms);
    
    await this.medicalLogRepository.create(medicalLog);

    return right({ medicalLog });
  }
}
