import { Either, left, right } from "@/core/either";
import { Device } from "../../../enterprise/entities/device";
import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "../../repositories/device-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface GetDeviceByTokenUseCaseRequest {
  token: string;
}

type GetDeviceByTokenUseCaseResponse = Either<
  ResourceNotFoundError<GetDeviceByTokenUseCaseRequest>,
  {
    device: Device;
  }
>;

@Injectable()
export class GetDeviceByTokenUseCase {

  constructor (
    private deviceRepository: DeviceRepository,
  ) {}

  async execute(
    data: GetDeviceByTokenUseCaseRequest,
  ): Promise<GetDeviceByTokenUseCaseResponse> {
    const device = await this.deviceRepository.findByToken(data.token);

    if (!device) {
      return left(new ResourceNotFoundError<GetDeviceByTokenUseCaseRequest>({
        errors: [
          {
            message: "Dispositivo não encontrado",
          }
        ],
      }));
    }

    return right({ device });
  }
}
