import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Gemini } from "@/domain/gemini-ai/gemini-ai";
import { AuthGuard } from "../../guards/auth-guard";
import { GetSelfMonitor } from "../../decorators/get-self-monitor";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { MedicalRecordPresenter } from "../../presenters/medical-record-presenter";
import { GetMedicalRecordBySelfMonitorIdUseCase } from "@/domain/medical/application/use-cases/medical-record/get-medical-record-by-self-monitor-id";

const bodySchema = z.object({
  question: z.string().min(1, "A pergunta deve ter pelo menos um caracter"),
  history: z.array(z.object({
    role: z.enum(["user", "model"]),
    text: z.string()
  })).optional()
});

type BodyDto = z.infer<typeof bodySchema>;

const bodyValidation = new ZodValidationPipe(bodySchema);

@Controller("chat")
export class ChatController {
  constructor (
    private gemini: Gemini,
    private getMedicalRecord: GetMedicalRecordBySelfMonitorIdUseCase
  ) {};

  @Post()
  @UseGuards(AuthGuard)
  async handle (
    @Body(bodyValidation) { question, history }: BodyDto,
    @GetSelfMonitor() selfMonitor: SelfMonitor
  ) {
    const answer = await this.gemini.chat({
      question,
      medicalRecord: selfMonitor &&
        await this.getMedicalRecord.execute({
          selfMonitorId: selfMonitor.id.toString()
        }).then(res => res.isRight() && res.value.medicalRecord),
      history: history?.map(message => ({
        role: message.role,
        parts: [{
          text: message.text
        }]
      }))
    });

    return { answer };
  }
}