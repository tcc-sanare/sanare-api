export interface SendMailProps {
  to: string;
  subject: string;
  body: string;
}

export abstract class MailProvider {
  abstract sendMail(props: SendMailProps): Promise<void>;
}