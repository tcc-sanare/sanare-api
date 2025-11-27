import { Account } from "@/domain/account/user/enterprise/entities/account";
import { GetMedicalReportDataUseCase } from "@/domain/medical/application/use-cases/medical-report/get-medical-report-data-use-case";
import { GetSelfMonitorByAccountIdUseCase } from "@/domain/medical/application/use-cases/self-monitor/get-self-monitor-by-account-id-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { MedicalLogPresenter } from "@/infra/http/presenters/medical-log-presenter";
import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { MedicalLog, MedicalLogProps } from "@/domain/medical/enterprise/entities/medical-log";
import { WatchedList } from "@/core/entities/watched-list";
import { MedicalLogSymptom } from "@/domain/medical/enterprise/entities/medical-log-symptom";

const querySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1900).max(new Date().getFullYear()),
});

type QueryDto = z.infer<typeof querySchema>;

const queryValidation = new ZodValidationPipe(querySchema);

@Controller("medical-report")
export class GetMedicalReportDataController {
  constructor(
    private getMedicalReportDataUseCase: GetMedicalReportDataUseCase,
    private findSelfMonitorByAccountId: GetSelfMonitorByAccountIdUseCase
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async handle(
    @Query(queryValidation) query: QueryDto,
    @GetAccount() account: Account
  ) {
    const selfMonitor = await this.findSelfMonitorByAccountId
      .execute({
        accountId: account.id,
      })
      .then((res) => {
        if (res.isLeft()) throw new CustomHttpException(res.value);
        return res.value.selfMonitor;
      });

    const result = await this.getMedicalReportDataUseCase
      .execute({
        month: query.month,
        year: query.year,
        selfMonitorId: selfMonitor.id,
      })
      .then((res) => {
        if (res.isLeft()) throw new CustomHttpException(res.value);
        return res.value;
      });

    return {
      data: extractParameterOfMedicalLogs(result.medicalLogs),
      month: result.month,
      year: result.year,
    };
  }
}

function extractParameterOfMedicalLogs(medicalLogs: MedicalLog[]) {
  const filterParams = ["selfMonitorId", "createdAt", "updatedAt", "id", "diseases"];
  function extractParam(param: keyof MedicalLogProps) {
    console.log({ param})
    return medicalLogs
      .map(medicalLog => MedicalLogPresenter.toHttp(medicalLog))
      .filter(medicalLog => {
        console.log(medicalLog)
        if (!medicalLog[param]) return false;

        if (Array.isArray(medicalLog[param]) && medicalLog[param].length === 0) return false;

        console.log({ param, value: medicalLog[param] instanceof WatchedList})

        return true;
      })
      .map(medicalLog => ({ 
        medicalLogId: medicalLog.id,
        value: param === "symptoms" ? medicalLog[param].map(symptom => symptom.symptomId.toString()) : medicalLog[param],
        date: medicalLog.createdAt
      }));
  }

  return Object.fromEntries(medicalLogs
    .flatMap(medicalLog => Object.entries(MedicalLogPresenter.toHttp(medicalLog))
    .filter(([key]) => !filterParams.includes(key))
    .map(([key]) => ([key, extractParam(key as any)])))
  )
}