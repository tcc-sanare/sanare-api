import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AccountProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Account extends Entity<AccountProps> {

  get name () {
    return this.props.name;
  }

  set name (name: string) {
    this.props.name = name;
    this.update();
  }

  get email () {
    return this.props.email;
  }

  set email (email: string) {
    this.props.email = email;
    this.update();
  }

  get password () {
    return this.props.password;
  }

  set password (password: string) {
    this.props.password = password;
    this.update();
  }

  get createdAt () {
    return this.props.createdAt;
  }

  get updatedAt () {
    return this.props.updatedAt;
  }

  private update () {
    this.props.updatedAt = new Date();
  }

  static async create (
    props: Optional<AccountProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const account = new Account({
      ...props,
      createdAt: new Date(),
    }, id);
    
    return account;
  };
}