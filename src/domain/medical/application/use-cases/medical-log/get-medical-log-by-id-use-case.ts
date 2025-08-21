import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { MedicalLog } from '@/domain/medical/enterprise/entities/medical-log';
import { Injectable } from '@nestjs/common';
import { MedicalLogRepository } from '../../repositories/medical-log-repository';

interface GetMedicalLogByIdUseCaseRequest {
  medicalLogId: string;
}

type GetMedicalLogByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetMedicalLogByIdUseCaseRequest>,
  {
    medicalLog: MedicalLog;
  }
>;

@Injectable()
export class GetMedicalLogByIdUseCase {
  constructor(private medicalLogRepository: MedicalLogRepository) {}

  async execute(
    request: GetMedicalLogByIdUseCaseRequest,
  ): Promise<GetMedicalLogByIdUseCaseResponse> {
    const medicalLog = await this.medicalLogRepository.findById(
      request.medicalLogId,
    );

    if (!medicalLog) {
      return left(
        new ResourceNotFoundError<GetMedicalLogByIdUseCaseRequest>({
          errors: [
            {
              message: 'Registro médico não encontrado',
            },
          ],
        }),
      );
    }
    return right({ medicalLog })
  }
}
