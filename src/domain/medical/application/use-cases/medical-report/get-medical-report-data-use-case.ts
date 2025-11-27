import { Either, right } from "@/core/either";
import { MedicalLog } from "@/domain/medical/enterprise/entities/medical-log";
import { Injectable } from "@nestjs/common";
import { MedicalLogRepository } from "../../repositories/medical-log-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface GetMedicalReportDataUseCaseRequest {
    month: number;
    year: number;
    selfMonitorId: UniqueEntityID
}

type GetMedicalReportDataUseCaseResponse = Either<
    null,
    {
        medicalLogs: MedicalLog[];
        month: number;
        year: number;
    }
>;

@Injectable()
export class GetMedicalReportDataUseCase {
    constructor (
        private medicalLogRepository: MedicalLogRepository,
    ) {};

    async execute (
        data: GetMedicalReportDataUseCaseRequest
    ): Promise<GetMedicalReportDataUseCaseResponse> {
        const medicalLogs = await this.medicalLogRepository.findBySelfMonitorId(
            data.selfMonitorId.toString(),
            {
                from: new Date(data.year, data.month - 1, 1),
                to: new Date(data.year, data.month, 0, 23, 59, 59, 999),
            }
        ) ?? [];

        return right({
            medicalLogs,
            month: data.month,
            year: data.year,
        });
    }
}