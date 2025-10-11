import { CaregiverRepository } from "@/domain/medical/application/repositories/caregiver-repository";
import { PrismaCaregiverMapper } from "../../mappers/medical/prisma-caregiver-mapper";
import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";
import { PrismaService } from "../../prisma.service";
import { Injectable } from "@nestjs/common";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";

@Injectable()
export class PrismaCaregiverRepository implements CaregiverRepository {
  constructor (
    private prisma: PrismaService
  ) {}

  async findByCaregiverCode(caregiverCode: UniqueCaregiverCode): Promise<Caregiver | null> {
    const caregiver = await this.prisma.caregiver.findFirst({
      where: {
        code: caregiverCode.toValue(),
      },
    });

    if (!caregiver) {
      return null;
    }

    return PrismaCaregiverMapper.toDomain(caregiver);
  }
  
  async findById(id: string): Promise<Caregiver | null> {
    const caregiver = await this.prisma.caregiver.findUnique({
      where: {
        id,
      },
    });

    if (!caregiver) {
      return null;
    }

    return PrismaCaregiverMapper.toDomain(caregiver);
  }
  
  async findByUserId(userId: string): Promise<Caregiver | null> {
    const caregiver = await this.prisma.caregiver.findFirst({
      where: {
        userId,
      },
    });

    if (!caregiver) {
      return null;
    }

    return PrismaCaregiverMapper.toDomain(caregiver);
  }

  async create(caregiver: Caregiver): Promise<void> {
    const data = PrismaCaregiverMapper.toPrisma(caregiver);

    await this.prisma.caregiver.create({
      data,
    });
  }

  async save(caregiver: Caregiver): Promise<void> {
    const data = PrismaCaregiverMapper.toPrisma(caregiver);

    await this.prisma.caregiver.update({
      where: {
        id: caregiver.id.toString(),
      },
      data,
    });
  }

  async delete(caregiver: Caregiver): Promise<void> {

    await this.prisma.$transaction([
      this.prisma.caregiverRequest.deleteMany({
        where: {
          caregiverId: caregiver.id.toString()
        }
      }),
      this.prisma.selfMonitor.updateMany({
        where: {
          caregiverId: caregiver.id.toString()
        },
        data: {
          caregiverId: null
        }
      }),
      this.prisma.caregiver.delete({
        where: {
          id: caregiver.id.toString(),
        }
      }),
    ])
  }
}