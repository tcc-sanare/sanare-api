import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { MedicalRecordRepository } from '../../repositories/medical-record-repository';
import { MedicalRecord } from '@/domain/medical/enterprise/entities/medical-record';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface GetMedicalRecordByIdUseCaseRequest {
  medicalRecordId: string;
}

type GetMedicalRecordByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetMedicalRecordByIdUseCaseRequest>,
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
      return left(new ResourceNotFoundError<GetMedicalRecordByIdUseCaseRequest>({
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
