import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Symptom } from '@/domain/medical/enterprise/entities/symptom';
import { PrismaSymptomMapper } from '../../mappers/medical/prisma-symptom-mapper';
import { SymptomRepository } from '@/domain/medical/application/repositories/symptom-repository';


@Injectable()
export class PrismaSymptomRepository implements SymptomRepository {
  constructor(private prisma: PrismaService) {}

  async create(symptom: Symptom): Promise<void> {
    const data = PrismaSymptomMapper.toPrisma(symptom);

    await this.prisma.symptoms.create({
      data,
    });
  }

  async delete(symptom: Symptom): Promise<void> {
    await this.prisma.medicalLogsToSymptoms
      .findFirst({
        where: {
          symptomId: symptom.id.toString(),
        },
      })
      .then(async (res) => {
        if (res) {
          await this.prisma.medicalLogsToSymptoms.delete({
            where: {
              medicalLogId_symptomId: {
                medicalLogId: res.medicalLogId,
                symptomId: res.symptomId,
              },
            },
          });
        }
      });

    await this.prisma.symptoms.delete({
      where: {
        id: symptom.id.toString(),
      },
    });
  }

  async save(symptom: Symptom): Promise<void> {
    const data = PrismaSymptomMapper.toPrisma(symptom);

    await this.prisma.symptoms.update({
      where: {
        id: symptom.id.toString(),
      },
      data,
    });
  }

  async findAll(): Promise<Symptom[] | null> {
    const symptoms = await this.prisma.symptoms.findMany();

    return symptoms.map(PrismaSymptomMapper.toDomain);
  }

  async findById(id: string): Promise<Symptom | null> {
    const symptom = await this.prisma.symptoms.findUnique({
      where: {
        id,
      },
    });

    if (!symptom) return null;

    return PrismaSymptomMapper.toDomain(symptom);
  }

  async findByName(name: string): Promise<Symptom[] | null> {
    const symptoms = await this.prisma.symptoms.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    if (!symptoms) return null;

    return symptoms.map(PrismaSymptomMapper.toDomain);
  }
}
