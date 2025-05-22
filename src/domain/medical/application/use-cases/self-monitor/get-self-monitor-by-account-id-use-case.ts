import { Either, left, right } from '@/core/either';
import { SelfMonitor } from '@/domain/medical/enterprise/entities/self-monitor';
import { Injectable } from '@nestjs/common';
import { SelfMonitorRepository } from '../../repositories/self-monitor-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface GetSelfMonitorByAccountIdUseCaseRequest {
  accountId: UniqueEntityID;
}

type GetSelfMonitorByAccountIdUseCaseResponse = Either<
  ResourceNotFoundError<GetSelfMonitorByAccountIdUseCaseRequest>,
  {
    selfMonitor: SelfMonitor;
  }
>;

@Injectable()
export class GetSelfMonitorByAccountIdUseCase {
  constructor(private selfMonitorRepository: SelfMonitorRepository) {}

  async execute({
    accountId,
  }: GetSelfMonitorByAccountIdUseCaseRequest): Promise<GetSelfMonitorByAccountIdUseCaseResponse> {
    const selfMonitor = await this.selfMonitorRepository.findByAccountId(accountId.toString());

    if (!selfMonitor) {
      return left(
        new ResourceNotFoundError<GetSelfMonitorByAccountIdUseCaseRequest>({
          errors: [
            {
              message: 'Perfil de auto-monitoramento não encontrado',
            },
          ],
        }),
      );
    }

    return right({ selfMonitor });
  }
}
