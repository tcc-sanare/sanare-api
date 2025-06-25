import { CaregiverRequest as PrismaCaregiverRequest } from "@prisma/client";
import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaCaregiverRequestMapper {
  static toDomain(prismaCaregiverRequest: PrismaCaregiverRequest): CaregiverRequest {
    return CaregiverRequest.create({
      caregiverId: new UniqueEntityID(prismaCaregiverRequest.caregiverId),
      selfMonitorId: new UniqueEntityID(prismaCaregiverRequest.selfMonitorId),
      status: prismaCaregiverRequest.status as "pending" | "accepted" | "rejected",
      createdAt: prismaCaregiverRequest.createdAt,
    }, new UniqueEntityID(prismaCaregiverRequest.id));
  }

  static toPrisma(caregiverRequest: CaregiverRequest): PrismaCaregiverRequest {
    return {
      id: caregiverRequest.id.toString(),
      caregiverId: caregiverRequest.caregiverId.toString(),
      selfMonitorId: caregiverRequest.selfMonitorId.toString(),
      status: caregiverRequest.status,
      createdAt: caregiverRequest.createdAt,
      updatedAt: caregiverRequest.updatedAt,
    };
  }
}