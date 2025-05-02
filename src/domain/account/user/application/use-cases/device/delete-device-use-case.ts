import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "../../repositories/device-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteDeviceUseCaseRequest {
  token: string;
  userId: string;
}

type DeleteDeviceUseCaseResponse = Either<
  
  NotAllowedError<DeleteDeviceUseCaseRequest>,
  {}
>;

@Injectable()
export class DeleteDeviceUseCase {
  constructor (
    private deviceRepository: DeviceRepository,
  ) {}

  async execute(
    data: DeleteDeviceUseCaseRequest,
  ): Promise<DeleteDeviceUseCaseResponse> {
    const device = await this.deviceRepository.findByToken(data.token);

    if (!device) {
      return left(new NotAllowedError<DeleteDeviceUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: "Dispositivo não encontrado",
          }
        ],
      }));
    }

    if (device.userId.toString() !== data.userId) {
      return left(new NotAllowedError<DeleteDeviceUseCaseRequest>({
        statusCode: 401,
        errors: [
          {
            message: "Dispositivo não pertence a este usuário",
          }
        ],
      }));
    }

    await this.deviceRepository.delete(device);

    return right({});
  }
}
