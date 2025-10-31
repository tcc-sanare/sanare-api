import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { GetProfileUseCase } from "./get-profile-use-case";
import { CreateCaregiverUseCase } from "@/domain/medical/application/use-cases/caregiver/create-caregiver-use-case";
import { DeleteCaregiverUseCase } from "@/domain/medical/application/use-cases/caregiver/delete-caregiver-use-case";
import { CreateSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/create-self-monitor-use-case";
import { UpdateSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/update-self-monitor-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { GetCaregiverByUserIdUseCase } from "@/domain/medical/application/use-cases/caregiver/get-caregiver-by-user-id-use-case";
import { DeleteSelfMonitorUseCase } from "@/domain/medical/application/use-cases/self-monitor/delete-self-monitor-use-case";

interface ChangeProfileUseCaseRequest {
    accountId: UniqueEntityID;
    profile: "caregiver" | "user";
}

type ChangeProfileUseCaseResponse = Either< 
    null,
    {}
>;

@Injectable()
export class ChangeProfileUseCase {
    constructor (
        private getProfileUseCase: GetProfileUseCase,
        private createCaregiverUseCase: CreateCaregiverUseCase,
        private getSelfMonitorByAccountId: GetSelfMonitorByAccountIdUseCase,
        private deleteCaregiverUseCase: DeleteCaregiverUseCase,
        private createSelfMonitorUseCase: CreateSelfMonitorUseCase,
        private getCaregiverByAccountId: GetCaregiverByUserIdUseCase,
        private updateSelfMonitorUseCase: UpdateSelfMonitorUseCase,
        private deleteSelfMonitorUseCase: DeleteSelfMonitorUseCase
    ) {}

    async execute (
        { accountId, profile: newProfile }: ChangeProfileUseCaseRequest
    ): Promise<ChangeProfileUseCaseResponse> {
        const profile = await this.getProfileUseCase.execute({ accountId })
            .then(res => res.isRight() && res.value.profile);

        if (profile === newProfile) {
            return right({});
        }

        const selfMonitor = await this.getSelfMonitorByAccountId.execute({ accountId })
            .then(res => res.isRight() ? res.value.selfMonitor : null);

        const caregiver = await this.getCaregiverByAccountId.execute({ userId: accountId.toString() })
            .then(res => res.isRight() ? res.value.caregiver : null);

        if (newProfile === "user") {
            if (selfMonitor && selfMonitor?.caregiverId) {
                await this.updateSelfMonitorUseCase.execute({ 
                    selfMonitorId: selfMonitor.id,
                    caregiverId: null
                });
            }

            if (!selfMonitor) {
                await this.createSelfMonitorUseCase.execute({ accountId });
            }

            if (caregiver) {
                await this.deleteCaregiverUseCase.execute({ caregiverId: caregiver.id });
            }
        }

        if (newProfile === "caregiver") {
            if (selfMonitor && selfMonitor?.caregiverId) {
                await this.updateSelfMonitorUseCase.execute({ 
                    selfMonitorId: selfMonitor.id,
                    caregiverId: null
                });
            }

            if (!caregiver) {
                await this.createCaregiverUseCase.execute({ userId: accountId.toString() });
            }
        }

        return right({});
    }
}