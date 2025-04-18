import { makeDevice } from "test/factories/make-device";
import { InMemoryDeviceRepository } from "test/repositories/in-memory-device-repository";
import { Device } from "../../../enterprise/entities/device";
import { GetDeviceByTokenUseCase } from "./get-device-by-token-use-case";

describe("GetDeviceByTokenUseCase", () => {
  let sut: GetDeviceByTokenUseCase;
  let inMemoryDeviceRepository: InMemoryDeviceRepository;

  beforeEach(() => {
    inMemoryDeviceRepository = new InMemoryDeviceRepository();
    sut = new GetDeviceByTokenUseCase(inMemoryDeviceRepository);
  });

  it("should be able to get a device by token", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: device.token,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.device).toBeInstanceOf(Device);
    expect(result.value?.device.token).toEqual(device.token);
    expect(result.value?.device.userId.toString()).toEqual(device.userId.toString());
    expect(result.value?.device.createdAt).toEqual(device.createdAt);
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });

  it("should not be able to get a non-existing device", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: "non-existing-token",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeNull();
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });

});
