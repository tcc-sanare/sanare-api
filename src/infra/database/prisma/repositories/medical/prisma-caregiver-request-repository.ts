import { CaregiverRequestRepository } from "@/domain/medical/application/repositories/caregiver-request-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { PrismaCaregiverRequestMapper } from "../../mappers/medical/prisma-caregiver-request-mapper";

@Injectable()
export class PrismaCaregiverRequestRepository implements CaregiverRequestRepository {
  constructor (
    private prisma: PrismaService
  ) {}

  async create(caregiverRequest: CaregiverRequest): Promise<void> {
    await this.prisma.caregiverRequest.create({
      data: PrismaCaregiverRequestMapper.toPrisma(caregiverRequest),
    });
  }

  async findById(caregiverRequestId: string): Promise<CaregiverRequest | null> {
    const caregiverRequest = await this.prisma.caregiverRequest.findUnique({
      where: { id: caregiverRequestId },
    });

    if (!caregiverRequest) {
      return null;
    }

    return PrismaCaregiverRequestMapper.toDomain(caregiverRequest);
  }

  async findByCaregiverId(caregiverId: string): Promise<CaregiverRequest[] | null> {
    const caregiverRequests = await this.prisma.caregiverRequest.findMany({
      where: { caregiverId },
    });

    return caregiverRequests.map(PrismaCaregiverRequestMapper.toDomain);
  }

  async findBySelfMonitorId(selfMonitorId: string): Promise<CaregiverRequest[] | null> {
    const caregiverRequests = await this.prisma.caregiverRequest.findMany({
      where: { selfMonitorId },
    });

    return caregiverRequests.map(PrismaCaregiverRequestMapper.toDomain);
  }

  async save(caregiverRequest: CaregiverRequest): Promise<void> {
    await this.prisma.caregiverRequest.update({
      where: { id: caregiverRequest.id.toString() },
      data: PrismaCaregiverRequestMapper.toPrisma(caregiverRequest),
    });
  }

  async delete(caregiverRequest: CaregiverRequest): Promise<void> {
    await this.prisma.caregiverRequest.delete({
      where: { id: caregiverRequest.id.toString() },
    });
  }
}