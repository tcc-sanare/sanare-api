import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SelfMonitor, SelfMonitorLogInput } from "@/domain/medical/enterprise/entities/self-monitor";
import { SelfMonitor as PrismaSelfMonitor, Prisma } from "@prisma/client";

export class PrismaSelfMonitorMapper {
  static toDomain(raw: PrismaSelfMonitor): SelfMonitor {
    return SelfMonitor.create({
      logInputs: raw.logInputs as unknown as SelfMonitorLogInput,
      accountId: new UniqueEntityID(raw.userId),
      caregiverId: raw.caregiverId ? new UniqueEntityID(raw.caregiverId) : raw.caregiverId as null | undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(selfMonitor: SelfMonitor): Prisma.SelfMonitorUncheckedCreateInput {
    console.log(selfMonitor);
    return {
      id: selfMonitor.id.toString(),
      userId: selfMonitor.accountId.toString(),
      caregiverId: selfMonitor.caregiverId ? selfMonitor.caregiverId.toString() : null,
      logInputs: selfMonitor.logInputs,
      createdAt: selfMonitor.createdAt,
      updatedAt: selfMonitor.updatedAt,
    };
  }
}