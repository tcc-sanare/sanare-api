import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { MedicalRecordRepository } from "@/domain/medical/application/repositories/medical-record-repository";
import { MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";
import { PrismaMedicalRecordMapper } from "../../mappers/medical/prisma-medical-record-mapper";

@Injectable()
export class PrismaMedicalRecordRepository implements MedicalRecordRepository {
  constructor (
    private readonly prisma: PrismaService,
  ) {}
  
  async create(medicalRecord: MedicalRecord): Promise<void> {
    const data = PrismaMedicalRecordMapper.toPrisma(medicalRecord);

    await this.prisma.medicalRecord.create({
      data: {
        ...data,
        allergies: {
          createMany: {
            data: medicalRecord.allergies.currentItems.map(allergy => ({
              allergyId: allergy.id.toString(),
            })),
          }
        },
        chronicDiseases: {
          createMany: {
            data: medicalRecord.chronicDiseases.currentItems.map(disease => ({
              chronicDiseaseId: disease.id.toString(),
            })),
          }
        }
      },
    });
  }
  
  async save(medicalRecord: MedicalRecord): Promise<void> {
    const data = PrismaMedicalRecordMapper.toPrisma(medicalRecord);

    await this.prisma.medicalRecord.update({
      where: {
        id: medicalRecord.id.toString(),
      },
      data: {
        ...data,
        allergies: {
          deleteMany: medicalRecord.allergies.getRemovedItems().map(allergy => ({
            allergyId: allergy.id.toString(),
          })),
          createMany: {
            data: medicalRecord.allergies.getNewItems().map(allergy => ({
              allergyId: allergy.id.toString(),
            })),
          }
        },
        chronicDiseases: {
          deleteMany: medicalRecord.chronicDiseases.getRemovedItems().map(disease => ({
            chronicDiseaseId: disease.id.toString(),
          })),
          createMany: {
            data: medicalRecord.chronicDiseases.getNewItems().map(disease => ({
              chronicDiseaseId: disease.id.toString(),
            })),
          }
        }
      },
    });
  }
  
  async findById(id: string): Promise<MedicalRecord | null> {
    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: {
        id,
      },
      include: {
        allergies: true,
        chronicDiseases: true,
      }
    });

    if (!medicalRecord) {
      return null;
    }

    return PrismaMedicalRecordMapper.toDomain(medicalRecord);
  }
  
  async findBySelfMonitorId(selfMonitorId: string): Promise<MedicalRecord | null> {
    const medicalRecord = await this.prisma.medicalRecord.findFirst({
      where: {
        selfMonitorId,
      },
      include: {
        allergies: true,
        chronicDiseases: true,
      }
    });

    if (!medicalRecord) {
      return null;
    }

    return PrismaMedicalRecordMapper.toDomain(medicalRecord);
  }
}
