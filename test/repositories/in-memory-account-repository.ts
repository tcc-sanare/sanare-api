import { AccountRepository } from "@/domain/account/user/application/repositories/account-repository";
import { Account } from "@/domain/account/user/enterprise/entities/account";

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = [];

  async save(account: Account): Promise<void> {
    this.items.push(account);
    return;
  }

  async delete(account: Account): Promise<void> {
    this.items = this.items.filter((item) => item.id !== account.id);
    return;
  }

  async findById(id: string): Promise<Account | null> {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.items.find((item) => item.email === email) || null;
  }
    
}