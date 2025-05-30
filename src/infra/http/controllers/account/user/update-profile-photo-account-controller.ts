import { UpdateMyAccountUseCase } from '@/domain/account/user/application/use-cases/account/update-my-account-use-case';
import { Controller, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('account/profile-photo')
export class UpdateProfilePhotoAccountController {
  constructor(private updateAccountUseCase: UpdateMyAccountUseCase) {}

  @Put()
  @UseInterceptors(FileInterceptor('photo'))
  async handle(@UploadedFile('photo') photo: any) {
    console.log(photo)
    return photo;
  }
}
