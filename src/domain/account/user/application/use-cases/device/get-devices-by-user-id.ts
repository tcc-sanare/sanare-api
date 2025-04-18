import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Device } from "../../../enterprise/entities/device";
import { DeviceRepository } from "../../repositories/device-repository";

interface GetDevicesByUserIdUseCaseRequest {
  userId: string;
}

type GetDevicesByUserIdUseCaseResponse = Either<
  null,
  {
    devices: Device[];
  }
>;

@Injectable()
export class GetDevicesByUserIdUseCase {
  constructor(private deviceRepository: DeviceRepository) {}

  async execute(
    data: GetDevicesByUserIdUseCaseRequest,
  ): Promise<GetDevicesByUserIdUseCaseResponse> {
    const devices = await this.deviceRepository.findByUserId(data.userId);

    if (!devices) {
      return left(null);
    }

    return right({ devices });
  }
}
