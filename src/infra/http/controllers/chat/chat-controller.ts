import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Gemini } from "@/domain/gemini-ai/gemini-ai";
import { AuthGuard } from "../../guards/auth-guard";
import { GetSelfMonitor } from "../../decorators/get-self-monitor";
import { SelfMonitor } from "@/domain/medical/enterprise/entities/self-monitor";
import { GetMedicalRecordBySelfMonitorIdUseCase } from "@/domain/medical/application/use-cases/medical-record/get-medical-record-by-self-monitor-id";
import { GetAccount } from "../../decorators/get-account";
import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetChronicDiseaseByIdUseCase } from "@/domain/medical/application/use-cases/chronic-disease/get-chronic-disease-by-id-use-case";
import { GetAllergyByIdUseCase } from "@/domain/medical/application/use-cases/allergy/get-allergy-by-id-use-case";
import { AllergyPresenter } from "../../presenters/allergy-presenter";
import { ChronicDiseasePresenter } from "../../presenters/chronic-disease-presenter";

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
    private getMedicalRecord: GetMedicalRecordBySelfMonitorIdUseCase,
    private getChronicDiseaseByIdUseCase: GetChronicDiseaseByIdUseCase,
    private getAllergieByIdUseCase: GetAllergyByIdUseCase
  ) {};

  @Post()
  @UseGuards(AuthGuard)
  async handle (
    @Body(bodyValidation) { question, history }: BodyDto,
    @GetSelfMonitor() selfMonitor: SelfMonitor,
    @GetAccount() account: Account
  ) {

    const medicalRecord = await this.getMedicalRecord.execute({
      selfMonitorId: selfMonitor.id.toString()
    })
    .then(res => res.isRight() && res.value.medicalRecord)

    const chronicDiseases = (await Promise.all(
      medicalRecord.chronicDiseases.currentItems.map(item => 
        this.getChronicDiseaseByIdUseCase.execute({
          chronicDiseaseId: item.chronicDiseaseId.toString()
        })
      )
    )).map(result => result.isRight() ? result.value.chronicDisease : null)
      .filter(Boolean)

    const allergies = (await Promise.all(
      medicalRecord.allergies.currentItems.map(item => 
        this.getAllergieByIdUseCase.execute({
          allergyId: item.allergyId.toString()
        })
      )
    )).map(result => result.isRight() ? result.value.allergy : null)
      .filter(Boolean)

    const answer = await this.gemini.chat({
      question,
      medicalRecord: {
        name: account.name,
        bloodType: medicalRecord.bloodType,
        allergies: allergies.map(item => AllergyPresenter.toHttp(item).name),
        chronicDiseases: chronicDiseases.map(item => ChronicDiseasePresenter.toHttp(item).name)
      },
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