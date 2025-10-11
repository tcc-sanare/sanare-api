import { Account } from "@/domain/account/user/enterprise/entities/account";

export class AccountPresenter {
  static toHTTP(account: Account) {
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
      profilePhotoUrl: profilePhoto?.getSignedUrl(),
      isVerified,
      createdAt,
      updatedAt
    };
  }
}