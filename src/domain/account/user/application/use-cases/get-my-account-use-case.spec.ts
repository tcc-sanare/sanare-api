import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository";
import { GetMyAccountUseCase } from "./get-my-account-use-case"
import { makeAccount } from "test/factories/make-account";

describe("GetMyAccountUseCase", () => {
  let getMyAccountUseCase: GetMyAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;

  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    getMyAccountUseCase = new GetMyAccountUseCase(inMemoryAccountRepository);
  })

  it("should return an account", async () => {
    const account = await makeAccount();

    await inMemoryAccountRepository.save(account);

    const response = await getMyAccountUseCase.execute({
      accountId: account.id.toString(),
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toEqual(account);
    expect(response.value.account.name).toBe(account.name);
    expect(response.value.account.email).toBe(account.email);

  });

  it("should return null if account does not exist", async () => {
    const response = await getMyAccountUseCase.execute({
      accountId: "1",
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});