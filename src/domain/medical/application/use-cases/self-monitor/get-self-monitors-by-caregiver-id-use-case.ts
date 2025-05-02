import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetSelfMonitorsByCaregiverIdUseCaseRequest {
  caregiverId: string;
}

type GetSelfMonitorsByCaregiverIdUseCaseResponse = Either<
  ResourceNotFoundError<GetSelfMonitorsByCaregiverIdUseCaseRequest>,
  {
    selfMonitors: SelfMonitor[];
  }
>;

@Injectable()
export class GetSelfMonitorsByCaregiverIdUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute({
    caregiverId,
  }: GetSelfMonitorsByCaregiverIdUseCaseRequest): Promise<GetSelfMonitorsByCaregiverIdUseCaseResponse> {
    const selfMonitors = await this.selfMonitorRepository.findByCaregiverId(caregiverId);

    if (!selfMonitors) {
      return left(new ResourceNotFoundError<GetSelfMonitorsByCaregiverIdUseCaseRequest>({
        errors: [
          {
            message: "Perfil de auto-monitoramento não encontrado",
          },
        ],
      }));
    }
    
    return right({ selfMonitors });
  }
}