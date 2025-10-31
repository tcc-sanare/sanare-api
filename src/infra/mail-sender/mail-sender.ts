import { MailProvider, SendMailProps } from "@/domain/mail-provider/mail-provider";
import { Injectable } from "@nestjs/common";
import { EnvService } from "../env/env.service";

@Injectable()
export class MailSender implements MailProvider {
  constructor (
    private envService: EnvService
  ) {};

  async sendMail(props: SendMailProps): Promise<void> {
    await fetch('https://webmailsender.vercel.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credentialType: "oauth2",
        credentials: {
          user: this.envService.get('EMAIL_USER'),
          clientId: this.envService.get('EMAIL_CLIENT_ID'),
          clientSecret: this.envService.get('EMAIL_CLIENT_SECRET'),
          refreshToken: this.envService.get('EMAIL_REFRESH_TOKEN'),
        },
        mailOptions: {
          from: `Sanare`,
          to: props.to,
          // to: 'silas.silva.freitas098@gmail.com',
          subject: props.subject,
          html: props.body,
        }
      }),
    });
  }
}