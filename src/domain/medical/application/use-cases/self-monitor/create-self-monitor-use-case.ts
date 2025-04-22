import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateSelfMonitorUseCaseRequest {
  userId: string;
}

type CreateSelfMonitorUseCaseResponse = Either<
  null,
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
    userId,
  }: CreateSelfMonitorUseCaseRequest): Promise<CreateSelfMonitorUseCaseResponse> {
    const selfMonitor = SelfMonitor.create({
      userId: new UniqueEntityID(userId),
    });

    if (await this.selfMonitorRepository.findByUserId(userId)) {
      return left(null);
    }

    await this.selfMonitorRepository.create(selfMonitor);

    return right({ selfMonitor });
  }
}