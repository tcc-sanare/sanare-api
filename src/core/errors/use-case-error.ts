export interface UseCaseErrorProps<T> {
  statusCode: number;
  errors: {
    path?: T[];
    message: string;
  }[]
}

export class UseCaseError<T> extends Error {
  constructor (props: UseCaseErrorProps<keyof T>) {
    super(JSON.stringify(props));
  }
}