import { MedicalLogRepository } from "@/domain/medical/application/repositories/medical-log-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { MedicalLog } from "@/domain/medical/enterprise/entities/medical-log";
import { PrismaMedicalLogMapper } from "../../mappers/medical/prisma-medical-log-mapper";

@Injectable()
export class PrismaMedicalLogRepository implements MedicalLogRepository {
    constructor (
        private readonly prisma: PrismaService
    ) {}

    async create(medicalLog: MedicalLog) {
        const data = PrismaMedicalLogMapper.toPrisma(medicalLog)

        await this.prisma.medicalLogs.create({
            data: {
                ...data,
                diseases: {
                    createMany: {
                        data: medicalLog.diseases.currentItems.map(disease => ({
                            diseaseId: disease.diseaseId.toString(),
                        }))
                    }
                },
                symptoms: {
                    createMany: {
                        data: medicalLog.symptoms.currentItems.map(symptom => ({
                            symptomId: symptom.symptomId.toString()
                        }))
                    }
                }
            },
        })
    }

    async save(medicalLog: MedicalLog): Promise<void> {
        const data = PrismaMedicalLogMapper.toPrisma(medicalLog)
        await this.prisma.medicalLogs.update({
            where: {
                id: medicalLog.id.toString()
            },
            data: {
                ...data,
                // bloodPressure: data.bloodPressure,
                // bloodSugar: data.bloodSugar,
                // createdAt: data.createdAt,
                // heartRate: data.heartRate,
                // mood: data.mood,
                // hydration: data.hydration,
                // selfMonitorId: data.selfMonitorId,

                diseases: {
                    deleteMany: medicalLog.diseases.getRemovedItems().map(disease => ({
                        diseaseId: disease.diseaseId.toString(),
                    })),
                    createMany: {
                        data: medicalLog.diseases.getNewItems().map(disease => ({
                            diseaseId: disease.diseaseId.toString(),
                        })),
                    }
                },
                
                symptoms: {
                    deleteMany: medicalLog.symptoms.getRemovedItems().map(symptom => ({
                        symptomId: symptom.symptomId.toString(),
                    })),
                    createMany: {
                        data: medicalLog.symptoms.getNewItems().map(symptom => ({
                            symptomId: symptom.symptomId.toString(),
                        })),
                    }
                }

            }
        })
    }

    async findBySelfMonitorId(selfMonitorId: string, date?: { from?: Date; to?: Date }): Promise<MedicalLog[] | null> {
        const medicalLogs = await this.prisma.medicalLogs.findMany({
            where: {
                selfMonitorId,
                createdAt: date && {
                    gte: date.from,
                    lte: date.to,
                }
            },
            include: {
                diseases: true,
                symptoms: true
            }
        })

        if(!medicalLogs) return null
        
        return medicalLogs.map(PrismaMedicalLogMapper.toDomain)
    }


    async findById(id: string): Promise<MedicalLog | null> {
        const medicalLog = await this.prisma.medicalLogs.findUnique({
            where: {
                id,
            },
            include: {
                diseases: true,
                symptoms: true
            }
        })

        if(!medicalLog) return null

        return PrismaMedicalLogMapper.toDomain(medicalLog)
    }
}