import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";
import { GetSelfMonitorByIdUseCase } from "../self-monitor/get-self-monitor-by-id-use-case";
import { UpdateSelfMonitorUseCase } from "../self-monitor/update-self-monitor-use-case";
import { GetMyAccountUseCase } from "@/domain/account/user/application/use-cases/account/get-my-account-use-case";
import { GetCaregiverByIdUseCase } from "../caregiver/get-caregiver-by-id-use-case";
import { NotificationProvider } from "@/domain/notification-provider/notification-provider";

interface UpdateCaregiverRequestUseCaseRequest {
  caregiverRequestId: UniqueEntityID;
  status: "accepted" | "rejected";
}

type UpdateCaregiverRequestUseCaseResponse = Either<
  NotAllowedError<UpdateCaregiverRequestUseCaseRequest>,
  {
    caregiverRequest: CaregiverRequest;
  }
>;

@Injectable()
export class UpdateCaregiverRequestUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
    private getSelfMonitorByIdUseCase: GetSelfMonitorByIdUseCase,
    private getCaregiverByIdUseCase: GetCaregiverByIdUseCase,
    private getAccountByIdUseCase: GetMyAccountUseCase,
    private updateSelfMonitorUseCase: UpdateSelfMonitorUseCase,
    private notificationProvider: NotificationProvider,
  ) {}

  async execute(
    request: UpdateCaregiverRequestUseCaseRequest,
  ): Promise<UpdateCaregiverRequestUseCaseResponse> {
    const { caregiverRequestId, status } = request;

    // Fetch the existing caregiver request
    const caregiverRequest = await this.caregiverRequestRepository.findById(caregiverRequestId.toString());
    if (!caregiverRequest) {
      return left(new NotAllowedError({
        statusCode: 404,
        errors: [
          {
            message: "Caregiver request not found.",
          },
        ],
      }));
    }

    caregiverRequest.status = status;

    const selfMonitor = await this.getSelfMonitorByIdUseCase.execute({
      selfMonitorId: caregiverRequest.caregiverId.toString(),
    }).then(result => {
      if (result.isLeft()) {
        return left(new NotAllowedError({
          statusCode: 404,
          errors: [
            {
              message: "Caregiver not found.",
            },
          ],
        }));
      }
      return result.value.selfMonitor;
    });

    if (status === "accepted") {

      await this.updateSelfMonitorUseCase.execute({
        selfMonitorId: caregiverRequest.selfMonitorId,
        caregiverId: caregiverRequest.caregiverId,
      }).then(result => {
        if (result.isLeft()) {
          return left(result.value);
        }

        return right(result.value.selfMonitor);
      });
    }

    await this.caregiverRequestRepository.save(caregiverRequest);

    const caregiver = await this.getCaregiverByIdUseCase.execute({ id: caregiverRequest.caregiverId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.caregiver;
      });

    const selfMonitorAccount = await this.getAccountByIdUseCase.execute({ accountId: caregiverRequest.selfMonitorId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.account;
      });

    const caregiverAccount = await this.getAccountByIdUseCase.execute({ accountId: caregiver.userId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.account;
      });

    if (caregiverAccount && selfMonitorAccount) {
      await this.notificationProvider.sendNotification({
        accountId: selfMonitorAccount.id,
        title: `Sua solicitação foi ${status === "accepted" ? "aceita" : "rejeitada"}!`,
        body: `${caregiverAccount.name} ${status === "accepted" ? "aceitou" : "rejeitou"} a sua solicitação para ser o cuidador(a) dele(a).`,
        data: {
          type: "CAREGIVER_REQUEST",
          path: `/caregivers/requests/${caregiverRequest.id.toString()}`
        }
      });
    }

    return right({
      caregiverRequest,
    });
  }
}