import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface CreateSelfMonitorUseCaseRequest {
  accountId: UniqueEntityID;
}

type CreateSelfMonitorUseCaseResponse = Either<
  NotAllowedError<CreateSelfMonitorUseCaseRequest>,
  {
    selfMonitor: SelfMonitor;
  }
>;

@Injectable()
export class CreateSelfMonitorUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute({
    accountId,
  }: CreateSelfMonitorUseCaseRequest): Promise<CreateSelfMonitorUseCaseResponse> {
    const selfMonitor = SelfMonitor.create({
      accountId: new UniqueEntityID(accountId.toString()),
      logInputs: null
    });

    if (await this.selfMonitorRepository.findByAccountId(accountId.toString())) {
      return left(new NotAllowedError<CreateSelfMonitorUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: "Já existe um perfil de auto-monitoramento para este usuário",
          },
        ],
      }));
    }

    await this.selfMonitorRepository.create(selfMonitor);

    return right({ selfMonitor });
  }
}