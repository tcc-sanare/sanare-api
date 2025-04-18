import { DeviceRepository } from "@/domain/account/user/application/repositories/device-repository";
import { Device } from "@/domain/account/user/enterprise/entities/device";

export class InMemoryDeviceRepository implements DeviceRepository {
  items: Device[];

  constructor () {
    this.items = [];
  }

  async create(device: Device): Promise<void> {
    const existingDevice = this.items.find(item => item.token === device.token);

    if (existingDevice) {
      throw new Error("Device already exists");
    }

    this.items.push(device);
  }

  async save(device: Device): Promise<void> {
    const index = this.items.findIndex(item => item.token === device.token);

    if (index === -1) {
      throw new Error("Device not found");
    }

    this.items[index] = device;
  }

  async delete(device: Device): Promise<void> {
    const index = this.items.findIndex(item => item.token === device.token);

    if (index === -1) {
      throw new Error("Device not found");
    }

    this.items.splice(index, 1);
  }

  async findByToken(token: string): Promise<Device | null> {
    const device = this.items.find(item => item.token === token);
    
    return device || null;
  }

  async findByUserId(userId: string): Promise<Device[] | null> {
    const devices = this.items.filter(item => item.userId.toString() === userId);

    return devices;
  }
  
}