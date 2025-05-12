import { Prisma, UserPhones as PrismaDevice } from "@prisma/client";
import { Device } from "@/domain/account/user/enterprise/entities/device";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaDeviceMapper {
  static toDomain(raw: PrismaDevice): Device {
    return Device.create({
      token: raw.token,
      userId: new UniqueEntityID(raw.userId),
    });
  }

  static toPrisma(device: Device): Prisma.UserPhonesUncheckedCreateInput {
    return {
      token: device.token,
      userId: device.userId.toString(),
    };
  }
}