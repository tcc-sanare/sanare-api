import { UpdateMyAccountUseCase } from "@/domain/account/user/application/use-cases/account/update-my-account-use-case";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { Controller, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express"
import { z } from "zod";

@Controller("account/profile-photo")
export class UpdateAccountProfilePhotoController {
  constructor (
    private updateMyAccountUseCase: UpdateMyAccountUseCase
  ) {}

  @Put()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("photo"))
  async handle (
    @UploadedFile("photo") photo: any
  ) {
    console.log(photo);
  }
}