import { InMemoryDeviceRepository } from "test/repositories/in-memory-device-repository";
import { CreateDeviceUseCase } from "./create-device-use-case";
import { makeDevice } from "test/factories/make-device";

describe("CreateDeviceUseCase", () => {
  let sut: CreateDeviceUseCase;
  let inMemoryDeviceRepository: InMemoryDeviceRepository;

  beforeEach(() => {
    inMemoryDeviceRepository = new InMemoryDeviceRepository();
    sut = new CreateDeviceUseCase(inMemoryDeviceRepository);
  });

  it("should be able to create a device", async () => {
    const device = makeDevice();

    const result = await sut.execute({
      token: device.token,
      userId: device.userId.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.device).toBeInstanceOf(Object);
    expect(result.value?.device.token).toEqual(device.token);
    expect(result.value?.device.userId.toString()).toEqual(device.userId.toString());
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });

  it("should not be able to create a device with the same token", async () => {
    const device = makeDevice();
    await inMemoryDeviceRepository.create(device);

    const result = await sut.execute({
      token: device.token,
      userId: device.userId.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeNull();
    expect(inMemoryDeviceRepository.items).toHaveLength(1);
  });
});