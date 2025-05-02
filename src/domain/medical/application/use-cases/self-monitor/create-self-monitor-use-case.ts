import { Either, left, right } from "@/core/either";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface CreateSelfMonitorUseCaseRequest {
  userId: string;
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
    userId,
  }: CreateSelfMonitorUseCaseRequest): Promise<CreateSelfMonitorUseCaseResponse> {
    const selfMonitor = SelfMonitor.create({
      userId: new UniqueEntityID(userId),
      logInputs: {
        bloodPressure: false,
        bloodSugar: false,
        hydration: false,
        imc: false,
        mood: false,
        symptoms: false,
      }
    });

    if (await this.selfMonitorRepository.findByUserId(userId)) {
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