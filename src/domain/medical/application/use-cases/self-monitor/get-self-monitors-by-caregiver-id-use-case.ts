import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";

interface GetSelfMonitorsByCaregiverIdUseCaseRequest {
  caregiverId: string;
}

type GetSelfMonitorsByCaregiverIdUseCaseResponse = Either<
  null,
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
      return left(null);
    }
    
    return right({ selfMonitors });
  }
}