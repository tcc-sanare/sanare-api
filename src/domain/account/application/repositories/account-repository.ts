import { Account } from "../../enterprise/entities/account";

export abstract class AccountRepository {
  abstract save(account: Account): Promise<void>;
  abstract delete(account: Account): Promise<void>;
  abstract findById(id: string): Promise<Account | null>;
  abstract findByEmail(email: string): Promise<Account | null>;
};