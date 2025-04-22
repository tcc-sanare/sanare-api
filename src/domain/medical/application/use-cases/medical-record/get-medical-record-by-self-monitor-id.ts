import { Either, left, right } from '@/core/either';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import { Injectable } from '@nestjs/common';

interface GetMedicalRecordBySelfMonitorIdUseCaseRequest {
  selfMonitorId: string;
}

type GetMedicalRecordBySelfMonitorIdUseCaseResponse = Either<
  null,
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
      return left(null);
    }

    return right({ medicalRecord });
  }
}
