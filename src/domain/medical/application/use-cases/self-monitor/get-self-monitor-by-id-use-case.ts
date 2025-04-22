import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";

interface GetSelfMonitorByIdUseCaseRequest {
  selfMonitorId: string;
}

type GetSelfMonitorByIdUseCaseResponse = Either<
  null,
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
      return left(null);
    }
    
    return right({ selfMonitor });
  }
}