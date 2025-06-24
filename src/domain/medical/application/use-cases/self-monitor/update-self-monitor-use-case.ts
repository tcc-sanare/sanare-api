import { Either, left, right } from "@/core/either";
import { SelfMonitor, SelfMonitorLogInput } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface UpdateSelfMonitorUseCaseRequest {
  selfMonitorId: string;
  caregiverId?: string;
  logInputs?: SelfMonitorLogInput | null;
}

type UpdateSelfMonitorUseCaseResponse = Either<
  NotAllowedError<UpdateSelfMonitorUseCaseRequest>,
  {
    selfMonitor: SelfMonitor;
  }
>;

@Injectable()
export class UpdateSelfMonitorUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute({
    selfMonitorId,
    caregiverId,
    logInputs
  }: UpdateSelfMonitorUseCaseRequest): Promise<UpdateSelfMonitorUseCaseResponse> {
    const selfMonitor = await this.selfMonitorRepository.findById(selfMonitorId);

    if (!selfMonitor) {
      return left(new NotAllowedError<UpdateSelfMonitorUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: "Perfil de auto-monitoramento não encontrado",
          },
        ],
      }));
    }

    caregiverId && (
      selfMonitor.caregiverId = new UniqueEntityID(caregiverId)
    )

    if (logInputs !== undefined) {
      selfMonitor.logInputs = logInputs;
    }

    await this.selfMonitorRepository.save(selfMonitor);

    return right({ selfMonitor });
  }
}
