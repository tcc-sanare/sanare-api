import { makeDevice } from "test/factories/make-device";
import { InMemoryDeviceRepository } from "test/repositories/in-memory-device-repository";
import { Device } from "../../../enterprise/entities/device";
import { UpdateDeviceUseCase } from "./update-device-use-case";

describe("UpdateDeviceUseCase", () => {
  let sut: UpdateDeviceUseCase;
  let inMemoryDeviceRepository: InMemoryDeviceRepository;

  beforeEach(() => {
    inMemoryDeviceRepository = new InMemoryDeviceRepository();
    sut = new UpdateDeviceUseCase(inMemoryDeviceRepository);
  });

  it("should be able to update a device", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);
    const newUserId = "new-user-id";

    const result = await sut.execute({
      token: device.token,
      userId: newUserId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.device).toBeInstanceOf(Device);
    expect(result.value?.device.token).toEqual(device.token);
    expect(result.value?.device.userId.toString()).toEqual(newUserId);
    expect(result.value?.device.createdAt).toEqual(device.createdAt);
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });

  it("should not be able to update a non-existing device", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: "non-existing-token",
      userId: device.userId.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeNull();
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });
});