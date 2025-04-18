import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Device } from "@/domain/account/user/enterprise/entities/device";

export function makeDevice(
  override: Partial<Device> = {},
  id?: UniqueEntityID,
): Device {
  return Device.create(
    {
      token: new UniqueEntityID().toString(),
      userId: new UniqueEntityID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...override,
    },
    id,
  );
}