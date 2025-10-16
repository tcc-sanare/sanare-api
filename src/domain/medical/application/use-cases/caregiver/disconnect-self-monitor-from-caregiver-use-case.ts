import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";

interface DisconnectSelfMonitorFromCaregiverUseCaseRequest {
  caregiverId: UniqueEntityID;
  selfMonitorId: UniqueEntityID;
}

type DisconnectSelfMonitorFromCaregiverUseCaseResponse = Either<
  NotAllowedError<DisconnectSelfMonitorFromCaregiverUseCaseRequest>,
  {}
>;

@Injectable()
export class DisconnectSelfMonitorFromCaregiverUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute({
    caregiverId,
    selfMonitorId
  }: DisconnectSelfMonitorFromCaregiverUseCaseRequest): Promise<DisconnectSelfMonitorFromCaregiverUseCaseResponse> {
    const selfMonitor = await this.selfMonitorRepository.findByCaregiverId(caregiverId.toString())
      .then(selfMonitors => selfMonitors.find(sm => sm.id.equals(selfMonitorId)));

    if (!selfMonitor) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "Dependente não encontrado"
          }
        ]
      }));
    }

    selfMonitor.caregiverId = null;

    await this.selfMonitorRepository.save(selfMonitor);

    return right({});
  }
}