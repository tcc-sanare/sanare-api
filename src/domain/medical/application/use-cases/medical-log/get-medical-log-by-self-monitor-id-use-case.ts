import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { MedicalLog } from '@/domain/medical/enterprise/entities/medical-log';
import { Injectable } from '@nestjs/common';
import { MedicalLogRepository } from '../../repositories/medical-log-repository';

interface GetMedicalLogBySelfMonitorIdUseCaseRequest {
  selfMonitorId: string;
}

type GetMedicalLogBySelfMonitorIdUseCaseResponse = Either<
  ResourceNotFoundError<GetMedicalLogBySelfMonitorIdUseCaseRequest>,
  {
    medicalLogs: MedicalLog[];
  }
>;

@Injectable()
export class GetMedicalLogBySelfMonitorIdUseCase {
  constructor(private medicalLogRepository: MedicalLogRepository) {}

  async execute(
    request: GetMedicalLogBySelfMonitorIdUseCaseRequest,
  ): Promise<GetMedicalLogBySelfMonitorIdUseCaseResponse> {
    const medicalLogs = await this.medicalLogRepository.findBySelfMonitorId(
      request.selfMonitorId,
    );

    if (medicalLogs.length === 0) {
      return left(
        new ResourceNotFoundError<GetMedicalLogBySelfMonitorIdUseCaseRequest>({
          errors: [
            {
              message: 'Nenhum registro médico não encontrados',
            },
          ],
        }),
      );
    }

    console.log(medicalLogs)
    return right({ medicalLogs })
  }
}
