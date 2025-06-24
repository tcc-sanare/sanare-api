import { UseCaseError } from '@/core/errors/use-case-error';
import { UpdateMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/update-my-account-use-case';
import { Account } from '@/domain/account/user/enterprise/entities/account';
import { GetAccount } from '@/infra/http/decorators/get-account';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { AuthGuard } from '@/infra/http/guards/auth-guard';
import { Controller, FileTypeValidator, ParseFilePipe, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';

@Controller('account/profile-photo')
export class UpdateProfilePhotoAccountController {
  constructor(private updateAccountUseCase: UpdateMyAccountUseCase) {}

  @Put()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async handle(
    @GetAccount() account: Account,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        exceptionFactory: () => new CustomHttpException(new UseCaseError({
          statusCode: 400,
          errors: [
            {
              message: 'Tipo de arquivo inválido. O arquivo deve ser uma imagem.',
              path: ['photo']
            }
          ]
        })),
        validators: [
          new FileTypeValidator({
            fileType: 'image/*',
          })
        ]
      })
    ) photo?: Express.Multer.File,
) {
  console.log(photo)
    await this.updateAccountUseCase.execute({
      accountId: account.id.toString(),
      profilePhoto: photo ? {
        fileName: photo.originalname,
        fileType: photo.mimetype,
        buffer: photo.buffer,
      } : null
    }).then((result) => {
      if (result.isLeft()) {
        throw new CustomHttpException(result.value);
      }

      return result.value;
    });

    return;
  }
}
