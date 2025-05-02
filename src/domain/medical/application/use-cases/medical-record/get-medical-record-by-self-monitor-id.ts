import { Either, left, right } from '@/core/either';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface GetMedicalRecordBySelfMonitorIdUseCaseRequest {
  selfMonitorId: string;
}

type GetMedicalRecordBySelfMonitorIdUseCaseResponse = Either<
  ResourceNotFoundError<GetMedicalRecordBySelfMonitorIdUseCaseRequest>,
  {
    medicalRecord: MedicalRecord;
  }
>;

@Injectable()
export class GetMedicalRecordBySelfMonitorIdUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    data: GetMedicalRecordBySelfMonitorIdUseCaseRequest,
  ): Promise<GetMedicalRecordBySelfMonitorIdUseCaseResponse> {
    const medicalRecord = await this.medicalRecordRepository.findBySelfMonitorId(
      data.selfMonitorId,
    );

    if (!medicalRecord) {
      return left(new ResourceNotFoundError<GetMedicalRecordBySelfMonitorIdUseCaseRequest>({
        errors: [
          {
            message: 'Prontuário médico não encontrado',
          },
        ],
      }));
    }

    return right({ medicalRecord });
  }
}
