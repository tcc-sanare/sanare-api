import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { Device } from "../../../enterprise/entities/device";
import { DeviceRepository } from "../../repositories/device-repository";

interface UpdateDeviceUseCaseRequest {
  token: string;
  userId: string;
}

type UpdateDeviceUseCaseResponse = Either<
  null,
  {
    device: Device;
  }
>;

@Injectable()
export class UpdateDeviceUseCase {

  constructor (
    private deviceRepository: DeviceRepository,
  ) {}

  async execute(
    data: UpdateDeviceUseCaseRequest,
  ): Promise<UpdateDeviceUseCaseResponse> {
    const device = await this.deviceRepository.findByToken(data.token);

    if (!device) {
      return left(null);
    }

    device.userId = new UniqueEntityID(data.userId);

    await this.deviceRepository.save(device);

    return right({ device });
  }
}
