import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "../../repositories/device-repository";

interface DeleteDeviceUseCaseRequest {
  token: string;
  userId: string;
}

type DeleteDeviceUseCaseResponse = Either<
  null,
  void
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
      return left(null);
    }

    if (device.userId.toString() !== data.userId) {
      return left(null);
    }

    await this.deviceRepository.delete(device);

    return right(undefined);
  }
}
