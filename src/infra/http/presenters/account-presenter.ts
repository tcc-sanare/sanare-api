import { Account } from "@/domain/account/user/enterprise/entities/account";

export class AccountPresenter {
  static async toHTTP(account: Account) {
    const {
      id,
      createdAt,
      email,
      isVerified,
      name,
      profilePhoto,
      theme,
      updatedAt
    } = account;
    
    return {
      id: id.toString(),
      name,
      email,
      theme,
      profilePhotoUrl: await profilePhoto?.getSignedUrl(),
      isVerified,
      createdAt,
      updatedAt
    };
  }
}