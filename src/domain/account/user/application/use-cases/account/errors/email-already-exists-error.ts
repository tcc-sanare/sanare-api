import { UseCaseError } from "@/core/errors/use-case-error";

export class EmailAlreadyExistsError extends UseCaseError<{ email: string }> {
  constructor(email: string) {
    super({
        statusCode: 400,
        errors: [
          {
            path: ['email'],
            message: `Já existe uma conta com o email "${email}"`,
          },
        ]
    });
  }
}