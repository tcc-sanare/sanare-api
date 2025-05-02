import { InMemoryDeviceRepository } from "test/repositories/in-memory-device-repository";
import { DeleteDeviceUseCase } from "./delete-device-use-case";
import { makeDevice } from "test/factories/make-device";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

describe("DeleteDeviceUseCase", () => {
  let sut: DeleteDeviceUseCase;
  let inMemoryDeviceRepository: InMemoryDeviceRepository;

  beforeEach(() => {
    inMemoryDeviceRepository = new InMemoryDeviceRepository();
    sut = new DeleteDeviceUseCase(inMemoryDeviceRepository);
  });

  it("should be able to delete a device", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: device.token,
      userId: device.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({});
    expect(inMemoryDeviceRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a device with a different userId", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: device.token,
      userId: "different-user-id",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });

  it("should not be able to delete a non-existing device", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: "non-existing-token",
      userId: device.userId.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });
});