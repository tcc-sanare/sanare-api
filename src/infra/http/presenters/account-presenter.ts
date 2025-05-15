import { Account } from "@/domain/account/user/enterprise/entities/account";

export class AccountPresenter {
  static toHttp(account: Account) {
    const {
      id,
      createdAt,
      email,
      isVerified,
      name,
      profilePhotoKey,
      theme,
      updatedAt
    } = account;
    
    return {
      id: id.toString(),
      name,
      email,
      theme,
      profilePhotoKey,
      isVerified,
      createdAt,
      updatedAt
    };
  }
}