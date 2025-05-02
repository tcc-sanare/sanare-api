import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Device } from "../../../enterprise/entities/device";
import { DeviceRepository } from "../../repositories/device-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetDevicesByUserIdUseCaseRequest {
  userId: string;
}

type GetDevicesByUserIdUseCaseResponse = Either<
  ResourceNotFoundError<GetDevicesByUserIdUseCaseRequest>,
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
      return left(new ResourceNotFoundError<GetDevicesByUserIdUseCaseRequest>({
        errors: [
          {
            message: "Dispositivos não encontrados",
          }
        ],
      }));
    }

    return right({ devices });
  }
}
