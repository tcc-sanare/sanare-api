import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Device } from "../../../enterprise/entities/device";
import { DeviceRepository } from "../../repositories/device-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateDeviceUseCaseRequest {
  token: string;
  userId: string;
};

type CreateDeviceUseCaseResponse = Either<
  null,
  {
    device: Device;
  }
>;

@Injectable()
export class CreateDeviceUseCase {
  
  constructor (
    private deviceRepository: DeviceRepository,
  ) {}

  async execute(
    data: CreateDeviceUseCaseRequest,
  ): Promise<CreateDeviceUseCaseResponse> {
    const device = Device.create({
      token: data.token,
      userId: new UniqueEntityID(data.userId),
      createdAt: new Date(),
    });

    if (await this.deviceRepository.findByToken(device.token)) {
      return left(null);
    }

    await this.deviceRepository.create(device);

    return right({ device });
  }
}
