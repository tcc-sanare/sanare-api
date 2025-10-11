import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { GetCaregiverByUserIdUseCase } from "@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { Injectable } from "@nestjs/common";

interface GetProfileUseCaseRequest {
    accountId: UniqueEntityID;
}

type GetProfileUseCaseResponse = Either< 
    null,
    {
        profile: "user" | "self-monitor" | "caregiver";
    }
>;

@Injectable()
export class GetProfileUseCase {
    constructor (
        private getSelfMonitorUseCase: GetSelfMonitorByAccountIdUseCase,
        private getCaregiverUseCase: GetCaregiverByUserIdUseCase
    ) {}

    async execute (
        data: GetProfileUseCaseRequest
    ): Promise<GetProfileUseCaseResponse> {
        const selfMonitor = await this.getSelfMonitorUseCase.execute({
            accountId: data.accountId
        }).then(res => res.isRight() ? res.value.selfMonitor : null);

        const caregiver = await this.getCaregiverUseCase.execute({
            userId: data.accountId.toString()
        }).then(res => res.isRight() ? res.value.caregiver : null);

        if (selfMonitor) {
            return right({
                profile: selfMonitor.caregiverId ? "self-monitor" : caregiver ? "caregiver" : "user"
            });
        }

        if (caregiver) {
            return right({
                profile: "caregiver"
            });
        }

        return right({
            profile: "user"
        });
    }
}