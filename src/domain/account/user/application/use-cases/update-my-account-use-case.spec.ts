import { InMemoryAccountRepository } from 'test/repositories/in-memory-account-repository';
import { UpdateMyAccountUseCase } from './update-my-account-use-case';
import { makeAccount } from 'test/factories/make-account';
import { InMemoryStorage } from 'test/storage/in-memory-storage';
import { readFileSync } from 'fs';
import { Account } from '../../enterprise/entities/account';

describe('UpdateMyAccountUseCase', () => {
  let updateMyAccountUseCase: UpdateMyAccountUseCase;
  let inMemoryAccountRepository: InMemoryAccountRepository;
  let inMemoryStorage: InMemoryStorage;

  beforeEach(() => {
    inMemoryStorage = new InMemoryStorage();
    inMemoryAccountRepository = new InMemoryAccountRepository();
    updateMyAccountUseCase = new UpdateMyAccountUseCase(
      inMemoryAccountRepository,
      inMemoryStorage
    );
  });

  it('should update an account name', async () => {
    const account = await makeAccount();

    await inMemoryAccountRepository.save(account);

    const response = await updateMyAccountUseCase.execute({
      accountId: account.id.toString(),
      name: 'new name',
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toEqual(account);
    expect(response.value.account.name).toBe('new name');
  });

  it('should update an account theme', async () => {
    const account = await makeAccount();

    await inMemoryAccountRepository.save(account);

    const response = await updateMyAccountUseCase.execute({
      accountId: account.id.toString(),
      theme: 'DARK',
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toEqual(account);
    expect(response.value.account.theme).toBe('DARK');
  });

  it('should update an account profile photo', async () => {
    const account = await makeAccount();

    await inMemoryAccountRepository.save(account);

    const file = new File([
      new Blob([
        readFileSync('./test/storage/test-files/profile-photo.webp')
      ])
    ], 'profile-photo.webp');

    const response = await updateMyAccountUseCase.execute({
      accountId: account.id.toString(),
      profilePhoto: {
        fileName: file.name,
        fileType: file.type,
        buffer: Buffer.from(await file.arrayBuffer()),
      },
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toBeInstanceOf(Account);
    expect(response.value.account.profilePhotoKey).not.toBeNull();
    expect(inMemoryStorage.items[0].fileKey).toBe(response.value.account.profilePhotoKey);
    
  })

  it('should remove an account profile photo', async () => {
    const account = await makeAccount();

    const file = new File([
      new Blob([
        readFileSync('./test/storage/test-files/profile-photo.webp')
      ])
    ], 'profile-photo.webp');

    account.profilePhotoKey = await inMemoryStorage.upload({
      fileName: file.name,
      fileType: file.type,
      buffer: Buffer.from(await file.arrayBuffer()),
    }).then(res => res.fileKey);

    await inMemoryAccountRepository.save(account);

    const response = await updateMyAccountUseCase.execute({
      accountId: account.id.toString(),
      profilePhoto: null,
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value.account).toBeInstanceOf(Account);
    expect(response.value.account.profilePhotoKey).toBeNull();
    expect(inMemoryStorage.items.length).toBe(0);
  });

  it('should return null if account does not exist', async () => {
    const response = await updateMyAccountUseCase.execute({
      accountId: '1',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeNull();
  });
});
