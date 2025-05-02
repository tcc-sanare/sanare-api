import { UseCaseError } from "@/core/errors/use-case-error";

interface Inputs {
  email: string;
  password: string;
}

export class WrongCredentialsError extends UseCaseError<Inputs> {
  constructor () {
    super({
      statusCode: 400,
      errors: [
        {
          message: "Email ou Senha inválidos",
          path: ['email', 'password']
        }
      ]
    });
  }
}