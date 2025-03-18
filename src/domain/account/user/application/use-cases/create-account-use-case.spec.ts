import { InMemoryAccountRepository } from "test/repositories/in-memory-account-repository"
import { CreateAccountUseCase } from "./create-account-use-case";
import { makeAccount } from "test/factories/make-account";
import { Account } from "../../enterprise/entities/account";
import { BcryptHasher } from "test/cryptography/bcrypt-hasher";

let inMemoryAccountRepository: InMemoryAccountRepository;
let bcryptGenerator: BcryptHasher;
let sut: CreateAccountUseCase;

describe("CreateAccountUseCase", () => {
  beforeEach(() => {
    inMemoryAccountRepository = new InMemoryAccountRepository();
    bcryptGenerator = new BcryptHasher();
    sut = new CreateAccountUseCase(
      inMemoryAccountRepository,
      bcryptGenerator
    );
  });

  it("should create a new account", async () => {
    const account = await makeAccount();

    const response = await sut.execute({
      name: account.name,
      email: account.email,
      password: account.password,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value.account).toBeInstanceOf(Account);
    expect(inMemoryAccountRepository.items[0]).toEqual(response.value!.account);
    expect(response.value.account.name).toBe(account.name);
    expect(response.value.account.email).toBe(account.email);
  });

  it("shold return left if account is already registered", async () => {
    console.log(inMemoryAccountRepository.items);
    const firstAccount = await makeAccount();

    
    await inMemoryAccountRepository.save(firstAccount);

    const secondAccount = await makeAccount({
      email: firstAccount.email,
    });

    const response2 = await sut.execute({
      name: secondAccount.name,
      email: secondAccount.email,
      password: secondAccount.password,
    });

    expect(response2.isLeft()).toBe(true);
    expect(response2.value).toBeNull();
    expect(inMemoryAccountRepository.items.length).toBe(1);
  });
});