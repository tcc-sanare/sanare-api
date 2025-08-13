import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";

export class SelfMonitorPresenter{
    static toHTTP(selfMonitor: SelfMonitor){
        return {
            id: selfMonitor.id.toString(),
            accountId: selfMonitor.accountId.toString(),
            caregiverId: selfMonitor.caregiverId?.toString(),
            createdAt: selfMonitor.createdAt,
            updatedAt: selfMonitor.updatedAt?.toString(),
            logsInputs: selfMonitor.logInputs
        }
    }
}