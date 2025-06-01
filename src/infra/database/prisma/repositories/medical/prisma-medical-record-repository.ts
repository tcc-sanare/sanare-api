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
    console.log(data.bloodType)

    await this.prisma.medicalRecord.create({
      data: {
        ...data,
        bloodType: data.bloodType,
        allergies: {
          createMany: {
            data: medicalRecord.allergies.currentItems.map(allergy => ({
              allergyId: allergy.allergyId.toString()
              // allergyId: "2c758d36-bda2-42ae-814b-3b20a3d355bf"
            })),
          }
        },
        chronicDiseases: {
          createMany: {
            data: medicalRecord.chronicDiseases.currentItems.map(disease => ({
              chronicDiseaseId: disease.chronicDiseaseId.toString()
              // chronicDiseaseId: "dd987c95-bc0b-46db-945a-1fcc6a2c226f"
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
            allergyId: allergy.allergyId.toString()
          })),
          createMany: {
            data: medicalRecord.allergies.getNewItems().map(allergy => ({
              allergyId: allergy.allergyId.toString(),
            })),
          }
        },
        chronicDiseases: {
          deleteMany: medicalRecord.chronicDiseases.getRemovedItems().map(disease => ({
            chronicDiseaseId: disease.chronicDiseaseId.toString(),
          })),
          createMany: {
            data: medicalRecord.chronicDiseases.getNewItems().map(disease => ({
              chronicDiseaseId: disease.chronicDiseaseId.toString(),
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
