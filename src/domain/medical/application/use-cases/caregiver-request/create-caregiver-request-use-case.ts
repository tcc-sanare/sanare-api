import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { Injectable } from "@nestjs/common";
import { CaregiverRequestRepository } from "../../repositories/caregiver-request-repository";
import { NotificationProvider } from "@/domain/notification-provider/notification-provider";
import { GetMyAccountUseCase } from "@/domain/account/user/application/use-cases/account/get-my-account-use-case";
import { GetCaregiverByIdUseCase } from "../caregiver/get-caregiver-by-id-use-case";
import { GetSelfMonitorByIdUseCase } from "../self-monitor/get-self-monitor-by-id-use-case";

interface CreateCaregiverRequestUseCaseRequest {
  caregiverId: UniqueEntityID;
  selfMonitorId: UniqueEntityID;
}

type CreateCaregiverRequestUseCaseResponse = Either< 
  NotAllowedError<CreateCaregiverRequestUseCaseRequest>,
  {
    caregiverRequest: CaregiverRequest;
  }
>;

@Injectable()
export class CreateCaregiverRequestUseCase {
  constructor(
    private caregiverRequestRepository: CaregiverRequestRepository,
    private getAccountByIdUseCase: GetMyAccountUseCase,
    private getSelfMonitorByIdUseCase: GetSelfMonitorByIdUseCase,
    private getCaregiverByIdUseCase: GetCaregiverByIdUseCase,
    private notificationProvider: NotificationProvider
  ) {}

  async execute(
    request: CreateCaregiverRequestUseCaseRequest,
  ): Promise<CreateCaregiverRequestUseCaseResponse> {
    const { caregiverId, selfMonitorId } = request;

    if (caregiverId.equals(selfMonitorId)) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "A self-monitor cannot request themselves as a caregiver.",
          },
        ],
      }));
    }

    // Check if a request already exists for the same caregiver and self-monitor
    const existingRequests = await this.caregiverRequestRepository.findBySelfMonitorId(selfMonitorId.toString());
    if (existingRequests.find(req => req.status === "pending")) {
      return left(new NotAllowedError({
        statusCode: 400,
        errors: [
          {
            message: "A pending caregiver request already exists for this self-monitor.",
          },
        ],
      }));
    }

    const caregiverRequest = CaregiverRequest.create({
      caregiverId,
      selfMonitorId,
      status: "pending",
      createdAt: new Date(),
    });

    await this.caregiverRequestRepository.create(caregiverRequest);

    const caregiver = await this.getCaregiverByIdUseCase.execute({ id: caregiverId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.caregiver;
      });

    const selfMonitor = await this.getSelfMonitorByIdUseCase.execute({ selfMonitorId: selfMonitorId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.selfMonitor;
      });

    const caregiverAccount = await this.getAccountByIdUseCase.execute({ accountId: caregiver.userId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.account;
      });

    const selfMonitorAccount = await this.getAccountByIdUseCase.execute({ accountId: selfMonitor.accountId.toString() })
      .then(result => {
        if (result.isLeft()) {
          return null;
        }
        return result.value.account;
      });

    if (caregiverAccount && selfMonitorAccount) {
      await this.notificationProvider.sendNotification({
        accountId: caregiverAccount.id,
        title: `Nova solicitação de dependente!`,
        body: `${selfMonitorAccount.name} enviou uma solicitação para que você seja o cuidador(a) dele(a).`,
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

