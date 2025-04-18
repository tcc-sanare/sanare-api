import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';

interface GetMedicalRecordByIdUseCaseRequest {
  medicalRecordId: string;
}

type GetMedicalRecordByIdUseCaseResponse = Either<
  null,
  {
    medicalRecord: MedicalRecord;
  }
>;

@Injectable()
export class GetMedicalRecordByIdUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    data: GetMedicalRecordByIdUseCaseRequest,
  ): Promise<GetMedicalRecordByIdUseCaseResponse> {
    const medicalRecord = await this.medicalRecordRepository.findById(
      data.medicalRecordId,
    );

    if (!medicalRecord) {
      return left(null);
    }

    return right({ medicalRecord });
  }
}
