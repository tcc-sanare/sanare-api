import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account-repository';
import { ForgotPasswordRepository } from '../../repositories/forgot-password-repository';
import { UniqueForgotPasswordCode } from '../../../enterprise/entities/value-object/unique-forgot-password-code';
import { ForgotPassword } from '../../../enterprise/entities/forgot-password';
import { MailProvider } from '@/domain/mail-provider/mail-provider';

interface SendForgotPasswordCodeUseCaseRequest {
  email: string;
}

type SendForgotPasswordCodeUseCaseResponse = Either<
  NotAllowedError<SendForgotPasswordCodeUseCaseRequest>,
  {}
>;

@Injectable()
export class SendForgotPasswordCodeUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private forgotPasswordRepository: ForgotPasswordRepository,
    private mailProvider: MailProvider
  ) {}

  async execute({
    email,
  }: SendForgotPasswordCodeUseCaseRequest): Promise<SendForgotPasswordCodeUseCaseResponse> {
    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      console.error(`Account with email ${email} not found.`);
      return right({});
    }

    const forgotPassword = ForgotPassword.create({
      accountId: account.id,
    });

    await this.forgotPasswordRepository.deleteByAccountId(account.id);
    await this.forgotPasswordRepository.create(forgotPassword);

    await this.mailProvider.sendMail({
      to: account.email,
      subject: 'Recuperação de senha - Sanare',
      body: emailBody({
        name: account.name,
        code: forgotPassword.code.toValue(),
        expireMinutes: UniqueForgotPasswordCode.getExpireMinutes()
      }),
    });

    return right({});
  }
}

const emailBody = ({
  name,
  code,
  expireMinutes
}: {
  name: string;
  code: string;
  expireMinutes: number;
}) => `
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Recuperação de senha — Sanare</title>
  <style>
    /* Reset básico para e-mails */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    a { text-decoration:none; }
    body { margin:0; padding:0; width:100% !important; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#333333; }
    .preheader { display:none !important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; }
    .button {
      display:inline-block;
      padding:14px 22px;
      border-radius:6px;
      background-color:#005eb7;
      color:#ffffff !important;
      font-weight:600;
      text-decoration:none;
      margin:12px auto;
    }
    .code {
      display:block;
      margin:12px auto;
      padding:10px 14px;
      border-radius:6px;
      background:#f1f5f9;
      font-weight:700;
      font-size:24px;
      letter-spacing:2px;
      color:#0b2540;
      max-width:200px;
      text-align:center;
    }
    /* Centralizar conteúdo */
    .container { margin: 0 auto; }
    .content { padding:32px 36px; text-align:center; }
    .header { padding:20px 24px; border-bottom:1px solid #e6e9ee; background:linear-gradient(90deg,#ffffff,#f7fbff); text-align:center; }
    .header-logo { display:block; margin:0 auto; }
    /* Responsivo */
    @media screen and (max-width:600px) {
      .container { width:100% !important; padding:16px !important; }
      .content { padding:20px !important; }
      .header-logo { width:120px !important; height:auto !important; }
    }
    /* Fallback for Outlook button */
    .outlook-button-fix { mso-hide: all; }
  </style>
</head>
<body>
  <!-- Preheader: texto curto que aparece na caixa de entrada -->
  <div class="preheader">Recupere sua senha do Sanare — link para redefinir dentro de ${expireMinutes} minutos.</div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f6f8">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <!-- Container principal -->
        <table class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
          <!-- Cabeçalho -->
          <tr>
            <td class="header">
              <!-- Logo (substitua src pelo logo real) -->
              <img src="https://lh3.googleusercontent.com/d/1AFdohlCnyi15RNft0oeABqrBqYXn3v7m?authuser=0" alt="Sanare" width="800" style="display:block; border:0; outline:none; text-decoration:none;" class="header-logo">
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td class="content">
              <h1 style="margin:0 0 12px 0; font-size:20px; color:#0b2540;">Recuperação de senha</h1>

              <p style="margin:0 0 18px 0; font-size:15px; line-height:1.5; color:#334155;">
                Olá ${name},
              </p>

              <p style="margin:0 0 18px 0; font-size:15px; line-height:1.5; color:#334155;">
                Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Sanare</strong>. Clique no botão abaixo para criar uma nova senha. O link expira em <strong>${expireMinutes} minutos</strong>.
              </p>

              <!-- Código de verificação (fallback caso o link não funcione) -->
              <p style="margin:0 0 18px 0; font-size:15px; line-height:1.5; color:#334155;">
                Caso prefira, use o código de verificação abaixo para validar a solicitação:
              </p>
              <div class="code">${code}</div>

              <p style="margin:0 0 8px 0; font-size:14px; color:#6b7280; line-height:1.5;">
                Se você não solicitou a alteração de senha, pode ignorar este e-mail — sua senha não será alterada.
              </p>

              <hr style="border:none; border-top:1px solid #eef2f7; margin:22px 0;" />

              <p style="margin:0 0 8px 0; font-size:13px; color:#64748b;">
                Precisa de ajuda? Responda este e-mail ou visite nossa central de suporte.
              </p>

              <p style="margin:12px 0 0 0; font-size:13px; color:#94a3b8;">
                — Equipe Sanare
              </p>
            </td>
          </tr>
        </table>

        <!-- Pequeno texto abaixo do container -->
        <table width="600" style="max-width:600px; margin-top:12px;">
          <tr>
            <td style="text-align:center; font-size:12px; color:#9aa6bd; padding:6px 0;">
              © <span id="year">${new Date().getFullYear()}</span> Sanare. Todos os direitos reservados.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;