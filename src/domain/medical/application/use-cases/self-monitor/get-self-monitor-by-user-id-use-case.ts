import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";

interface GetSelfMonitorByUserIdUseCaseRequest {
  userId: string;
}

type GetSelfMonitorByUserIdUseCaseResponse = Either<
  null,
  {
    selfMonitor: SelfMonitor;
  }
>;

@Injectable()
export class GetSelfMonitorByUserIdUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository
  ) {}

  async execute({
    userId,
  }: GetSelfMonitorByUserIdUseCaseRequest): Promise<GetSelfMonitorByUserIdUseCaseResponse> {
    const selfMonitor = await this.selfMonitorRepository.findByUserId(userId);

    if (!selfMonitor) {
      return left(null);
    }
    
    return right({ selfMonitor });
  }
}