import { SelfMonitorRepository } from "@/domain/medical/application/repositories/self-monitor-repository";
import { Injectable } from "@nestjs/common";
import { PrismaSelfMonitorMapper } from "../../mappers/medical/prisma-self-monitor-mapper";
import { PrismaService } from "../../prisma.service";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";

@Injectable()
export class PrismaSelfMonitorRepository implements SelfMonitorRepository {
  constructor (
    private prisma: PrismaService
  ) {}
  
  async findById(id: string): Promise<SelfMonitor | null> {
    const selfMonitor = await this.prisma.selfMonitor.findUnique({
      where: {
        id,
      },
    });

    if (!selfMonitor) {
      return null;
    }

    return PrismaSelfMonitorMapper.toDomain(selfMonitor);
  }
  
  async findByAccountId(accountId: string): Promise<SelfMonitor | null> {
    const selfMonitor = await this.prisma.selfMonitor.findFirst({
      where: {
        userId: accountId,
      },
    });

    if (!selfMonitor) {
      return null;
    }

    return PrismaSelfMonitorMapper.toDomain(selfMonitor);
  }
  
  async findByCaregiverId(caregiverId: string): Promise<SelfMonitor[] | null> {
    const selfMonitors = await this.prisma.selfMonitor.findMany({
      where: {
        caregiverId,
      },
    });

    if (!selfMonitors) {
      return null;
    }

    return selfMonitors.map(PrismaSelfMonitorMapper.toDomain);
  }
  
  async create(selfMonitor: SelfMonitor): Promise<void> {
    const data = PrismaSelfMonitorMapper.toPrisma(selfMonitor);

    await this.prisma.selfMonitor.create({
      data,
    });
  }
  
  async save(selfMonitor: SelfMonitor): Promise<void> {
    const data = PrismaSelfMonitorMapper.toPrisma(selfMonitor);

    await this.prisma.selfMonitor.update({
      where: {
        id: selfMonitor.id.toString(),
      },
      data,
    });
  }
  
  async delete(selfMonitor: SelfMonitor): Promise<void> {
    await this.prisma.selfMonitor.delete({
      where: {
        id: selfMonitor.id.toString(),
      },
    });
  }
}
