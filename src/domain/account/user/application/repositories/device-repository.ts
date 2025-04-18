import { Device } from "../../enterprise/entities/device";

export abstract class DeviceRepository {
  abstract create(device: Device): Promise<void>;
  abstract save(device: Device): Promise<void>;
  abstract delete(device: Device): Promise<void>;
  abstract findByToken(token: string): Promise<Device | null>;
  abstract findByUserId(userId: string): Promise<Device[] | null>;
}