import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetSelfMonitorByIdUseCaseRequest {
  selfMonitorId: string;
}

type GetSelfMonitorByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetSelfMonitorByIdUseCaseRequest>,
  {
    selfMonitor: SelfMonitor
  }
>;

@Injectable()
export class GetSelfMonitorByIdUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute({
    selfMonitorId,
  }: GetSelfMonitorByIdUseCaseRequest): Promise<GetSelfMonitorByIdUseCaseResponse> {
    const selfMonitor = await this.selfMonitorRepository.findById(selfMonitorId);

    if (!selfMonitor) {
      return left(new ResourceNotFoundError<GetSelfMonitorByIdUseCaseRequest>({
        errors: [
          {
            message: "Perfil de auto-monitoramento não encontrado",
          },
        ],
      }));
    }
    
    return right({ selfMonitor });
  }
}