import { DiseaseRepository } from '@/domain/medical/application/repositories/disease-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Disease } from '@/domain/medical/enterprise/entities/disease';
import { PrismaDiseaseMapper } from '../../mappers/medical/prisma-disease-mapper';

@Injectable()
export class PrismaDiseaseRepository implements DiseaseRepository {
  constructor(private prisma: PrismaService) {}

  async create(disease: Disease): Promise<void> {
    const data = PrismaDiseaseMapper.toPrisma(disease);

    await this.prisma.diseases.create({
      data,
    });
  }

  async delete(disease: Disease): Promise<void> {
    await this.prisma.medicalLogsToDiseases
      .findFirst({
        where: {
          diseaseId: disease.id.toString(),
        },
      })
      .then(async (res) => {
        if (res) {
          await this.prisma.medicalLogsToDiseases.delete({
            where: {
              medicalLogId_diseaseId: {
                medicalLogId: res.medicalLogId,
                diseaseId: res.diseaseId,
              },
            },
          });
        }
      });

    await this.prisma.diseases.delete({
      where: {
        id: disease.id.toString(),
      },
    });
  }

  async save(disease: Disease): Promise<void> {
    const data = PrismaDiseaseMapper.toPrisma(disease);

    await this.prisma.diseases.update({
      where: {
        id: disease.id.toString(),
      },
      data,
    });
  }

  async findAll(): Promise<Disease[] | null> {
    const diseases = await this.prisma.diseases.findMany();

    return diseases.map(PrismaDiseaseMapper.toDomain);
  }

  async findById(id: string): Promise<Disease | null> {
    const disease = await this.prisma.diseases.findUnique({
      where: {
        id,
      },
    });

    if (!disease) return null;

    return PrismaDiseaseMapper.toDomain(disease);
  }

  async findByName(name: string): Promise<Disease[] | null> {
    const diseases = await this.prisma.diseases.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    if (!diseases) return null;

    return diseases.map(PrismaDiseaseMapper.toDomain);
  }
}
