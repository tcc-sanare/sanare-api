import { Either, left, right } from '@/core/either';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import { Injectable } from '@nestjs/common';

interface GetMedicalRecordByUserIdUseCaseRequest {
  userId: string;
}

type GetMedicalRecordByIdUseCaseResponse = Either<
  null,
  {
    medicalRecord: MedicalRecord;
  }
>;

@Injectable()
export class GetMedicalRecordByUserIdUseCase {
  constructor(private medicalRecordRepository: MedicalRecordRepository) {}

  async execute(
    data: GetMedicalRecordByUserIdUseCaseRequest,
  ): Promise<GetMedicalRecordByIdUseCaseResponse> {
    const medicalRecord = await this.medicalRecordRepository.findByUserId(
      data.userId,
    );

    if (!medicalRecord) {
      return left(null);
    }

    return right({ medicalRecord });
  }
}
