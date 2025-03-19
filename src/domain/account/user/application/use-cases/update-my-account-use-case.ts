import { Either, left, right } from '@/core/either';
import { Account } from '../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../repositories/account-repository';
import { Storage } from '@/domain/application/storage';

interface UpdateMyAccountUseCaseRequest {
  accountId: string;
  name?: string;
  theme?: 'LIGHT' | 'DARK';
  profilePhoto?: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
}

type UpdateMyAccountUseCaseResponse = Either<
  null,
  {
    account: Account;
  }
>;

@Injectable()
export class UpdateMyAccountUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private storage: Storage,
  ) {}

  async execute(
    request: UpdateMyAccountUseCaseRequest,
  ): Promise<UpdateMyAccountUseCaseResponse> {
    const account = await this.accountRepository.findById(request.accountId);

    if (!account) {
      return left(null);
    }

    account.name = request.name || account.name;
    account.theme = request.theme || account.theme;
    
    if (request.profilePhoto !== undefined) {
      if (account.profilePhotoKey) {
        await this.storage.delete(account.profilePhotoKey);
      }
      
      account.profilePhotoKey = request.profilePhoto ? await this.storage.upload({
        fileName: request.profilePhoto.fileName,
        fileType: request.profilePhoto.fileType,
        buffer: request.profilePhoto.buffer,
      }).then(res => res.fileKey) : null;
    }

    await this.accountRepository.save(account);

    return right({
      account,
    });
  }
}
