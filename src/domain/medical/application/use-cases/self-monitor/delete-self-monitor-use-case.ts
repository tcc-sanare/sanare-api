import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";

interface DeleteSelfMonitorUseCaseRequest {
  selfMonitorId: UniqueEntityID;
}

type DeleteSelfMonitorUseCaseResponse = Either< 
  NotAllowedError<DeleteSelfMonitorUseCaseRequest>,
  {}
>;

@Injectable()
export class DeleteSelfMonitorUseCase {
  constructor (
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute (
    { selfMonitorId }: DeleteSelfMonitorUseCaseRequest
  ): Promise<DeleteSelfMonitorUseCaseResponse> {
    const selfMonitor = await this.selfMonitorRepository.findById(selfMonitorId.toString());

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

    await this.selfMonitorRepository.delete(selfMonitor);

    return right({});
  }
}