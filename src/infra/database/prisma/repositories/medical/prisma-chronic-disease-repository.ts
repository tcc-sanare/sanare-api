import { ChronicDiseaseRepository } from "@/domain/medical/application/repositories/chronic-disease-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ChronicDisease } from "@/domain/medical/enterprise/entities/chronic-disease";
import { PrismaChronicDiseaseMapper } from "../../mappers/medical/prisma-chronic-disease-mapper";

@Injectable()
export class PrismaChronicDiseaseRepository implements ChronicDiseaseRepository {
  constructor (
    private prisma: PrismaService
  ) {}
  
  async create(chronicDisease: ChronicDisease): Promise<void> {
    const data = PrismaChronicDiseaseMapper.toPrisma(chronicDisease);

    await this.prisma.chronicDiseases.create({
      data,
    });
  }
  
  async findAll(): Promise<ChronicDisease[]> {
    const chronicDiseases = await this.prisma.chronicDiseases.findMany();

    return chronicDiseases.map(PrismaChronicDiseaseMapper.toDomain);
  }
  
  async save(chronicDisease: ChronicDisease): Promise<void> {
    const data = PrismaChronicDiseaseMapper.toPrisma(chronicDisease);

    await this.prisma.chronicDiseases.update({
      where: {
        id: chronicDisease.id.toString(),
      },
      data,
    });
  }
  
  async delete(chronicDisease: ChronicDisease): Promise<void> {

    await this.prisma.medicalRecordToChronicDiseases.findFirst({
      where: {
        chronicDiseaseId: chronicDisease.id.toString()
      }
    })
    .then(async (res) => {
      if (res) {
        await this.prisma.medicalRecordToChronicDiseases.delete({
          where: {
            medicalRecordId_chronicDiseaseId: {
              medicalRecordId: res.medicalRecordId,
              chronicDiseaseId: res.chronicDiseaseId
            }
          }
        })
      }
    })

    await this.prisma.chronicDiseases.delete({
      where: {
        id: chronicDisease.id.toString(),
      },
    });
  }
  
  async findById(id: string): Promise<ChronicDisease | null> {
    const chronicDisease = await this.prisma.chronicDiseases.findUnique({
      where: {
        id,
      },
    });

    if (!chronicDisease) {
      return null;
    }

    return PrismaChronicDiseaseMapper.toDomain(chronicDisease);
  }
  
  async findByName(name: string): Promise<ChronicDisease[] | null> {
    const chronicDiseases = await this.prisma.chronicDiseases.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        }
      },
    });

    if (!chronicDiseases) {
      return null;
    }

    return chronicDiseases.map(PrismaChronicDiseaseMapper.toDomain);
  }

}