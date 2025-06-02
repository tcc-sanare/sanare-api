import { Either, left, right } from '@/core/either';
import { Account } from '../../../enterprise/entities/account';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { Storage } from '@/domain/application/storage';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

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
  NotAllowedError<UpdateMyAccountUseCaseRequest>,
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
      return left(new NotAllowedError<UpdateMyAccountUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Conta não encontrada',
          },
        ],
      }));
    }

    request.name && (account.name = request.name);
    request.theme && (account.theme = request.theme);

    if (request.profilePhoto !== undefined) {
      if (account.profilePhoto) {
        await account.profilePhoto.delete();
      }

      account.profilePhoto = request.profilePhoto
        ? await this.storage
            .upload({
              fileName: request.profilePhoto.fileName,
              fileType: request.profilePhoto.fileType,
              buffer: request.profilePhoto.buffer,
            })
        : null;
    }

    await this.accountRepository.save(account);

    return right({
      account,
    });
  }
}
