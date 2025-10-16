import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";
import { SelfMonitorRepository } from "../../repositories/self-monitor-repository";
import { Encrypter } from "@/domain/account/cryptography/encrypter";

interface GetSelfMonitorAccessUseCaseRequest {
  caregiverId: UniqueEntityID;
  selfMonitorId: UniqueEntityID;
}

type GetSelfMonitorAccessUseCaseResponse = Either<
  NotAllowedError<GetSelfMonitorAccessUseCaseRequest>,
  { accessToken: string, selfMonitorId: UniqueEntityID }
>;

@Injectable()
export class GetSelfMonitorAccessUseCase {
  constructor(
    private selfMonitorRepository: SelfMonitorRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    caregiverId,
    selfMonitorId
  }: GetSelfMonitorAccessUseCaseRequest): Promise<GetSelfMonitorAccessUseCaseResponse> {
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

    const accessToken = await this.encrypter.encrypt({
      sub: selfMonitor.id.toString(),
      role: 'caregiver'
    });

    return right({ accessToken, selfMonitorId: selfMonitor.id });
  }
}