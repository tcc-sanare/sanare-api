import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeDevice } from "test/factories/make-device";
import { InMemoryDeviceRepository } from "test/repositories/in-memory-device-repository";
import { GetDevicesByUserIdUseCase } from "./get-devices-by-user-id";

describe("GetDevicesByUserIdUseCase", () => {
  let sut: GetDevicesByUserIdUseCase;
  let inMemoryDeviceRepository: InMemoryDeviceRepository;

  beforeEach(() => {
    inMemoryDeviceRepository = new InMemoryDeviceRepository();
    sut = new GetDevicesByUserIdUseCase(inMemoryDeviceRepository);
  });

  it("should be able to get devices by userId", async () => {
    const userId = "user-id";

    for (let i = 0; i < 5; i++) {
      const device = makeDevice({
        userId: new UniqueEntityID(userId),
      });
      await inMemoryDeviceRepository.create(device);
    }

    for (let i = 0; i < 5; i++) {
      const device = makeDevice({
        userId: new UniqueEntityID("other-user-id"),
      });
      await inMemoryDeviceRepository.create(device);
    }

    const result = await sut.execute({
      userId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.devices).toHaveLength(5);
    expect(result.value.devices.every((device) => device.userId.toString() === userId)).toBeTruthy();
  });

  it("should return an empty array if no devices are found for the userId", async () => {
    const userId = "non-existing-user-id";

    for (let i = 0; i < 5; i++) {
      const device = makeDevice({
        userId: new UniqueEntityID("other-user-id"),
      });

      await inMemoryDeviceRepository.create(device);
    }

      const result = await sut.execute({
        userId,
      });

      expect(result.isRight()).toBeTruthy();
      expect(result.value?.devices).toHaveLength(0);
  });
});
