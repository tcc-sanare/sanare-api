import { Entity } from '@/core/entities/entity';
import { StoragedFile } from '@/core/entities/storaged-file';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AccountProps {
  name: string;
  email: string;
  password: string;
  profilePhoto: StoragedFile | null;
  isVerified: boolean;
  theme: 'LIGHT' | 'DARK';

  createdAt: Date;
  updatedAt?: Date;
}

export class Account extends Entity<AccountProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.update();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.update();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.update();
  }

  get theme() {
    return this.props.theme;
  }

  set theme(theme: 'LIGHT' | 'DARK') {
    this.props.theme = theme;
    this.update();
  }

  get profilePhoto() {
    return this.props.profilePhoto;
  }

  set profilePhoto(profilePhoto: StoragedFile | null) {
    this.props.profilePhoto = profilePhoto;
    this.update();
  }

  get isVerified() {
    return this.props.isVerified;
  }

  set isVerified(state: boolean) {
    this.props.isVerified = state;
    this.update();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private update() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<AccountProps, 'createdAt' | 'theme'>,
    id?: UniqueEntityID,
  ) {
    const account = new Account(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        theme: props.theme ?? 'LIGHT',
      },
      id ?? new UniqueEntityID(),
    );

    return account;
  }
}
