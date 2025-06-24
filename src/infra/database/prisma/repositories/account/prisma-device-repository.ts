import { DeviceRepository } from "@/domain/account/user/application/repositories/device-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Device } from "@/domain/account/user/enterprise/entities/device";
import { PrismaDeviceMapper } from "../../mappers/account/prisma-device-mapper";

@Injectable()
export class PrismaDeviceRepository implements DeviceRepository {
  constructor (
    private prisma: PrismaService
  ) {}
  
  async create(device: Device): Promise<void> {
    const data = PrismaDeviceMapper.toPrisma(device);

    await this.prisma.userPhones.create({
      data,
    });
  }
  
  async save(device: Device): Promise<void> {
    const data = PrismaDeviceMapper.toPrisma(device);

    await this.prisma.userPhones.update({
      where: {
        token: device.token,
      },
      data,
    });
  }
  
  async delete(device: Device): Promise<void> {
    await this.prisma.userPhones.delete({
      where: {
        token: device.token,
      },
    });
  }
  
  async findByToken(token: string): Promise<Device | null> {
    const device = await this.prisma.userPhones.findUnique({
      where: {
        token,
      },
    });

    if (!device) {
      return null;
    }

    return PrismaDeviceMapper.toDomain(device);
  }
  
  async findByUserId(userId: string): Promise<Device[] | null> {
    const devices = await this.prisma.userPhones.findMany({
      where: {
        userId,
      },
    });

    if (!devices) {
      return null;
    }

    return devices.map((device) => PrismaDeviceMapper.toDomain(device));
  }
}