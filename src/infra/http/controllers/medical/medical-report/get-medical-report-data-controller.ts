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
import { GetDiseaseByIdUseCase } from "@/domain/medical/application/use-cases/disease/get-disease-by-id-use-case";
import { GetSymptomByIdUseCase } from "@/domain/medical/application/use-cases/symptom/get-symptom-by-id-use-case";
import { Gemini } from "@/domain/gemini-ai/gemini-ai";

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
    private findSelfMonitorByAccountId: GetSelfMonitorByAccountIdUseCase,
    private getSymptomById: GetSymptomByIdUseCase,
    private gemini: Gemini
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
      })

    const getData = async () => {
      const symptomsId: (string | null)[] = []
      const bloodPressure: string[] = []
      const hydratation: number[] = []
      const mood: string[] = []
      const heartRate: number[] = []
      const bloodSugar: number[] = []
      const createdAt: Date[] = []

      result.medicalLogs.map(medicalLog => {
        medicalLog.bloodPressure && bloodPressure.push(medicalLog.bloodPressure)
        medicalLog.hydratation && hydratation.push(medicalLog.hydratation)
        medicalLog.mood && mood.push(medicalLog.mood)
        medicalLog.hearthRate && heartRate.push(medicalLog.hearthRate)
        medicalLog.bloodSugar && bloodSugar.push(medicalLog.bloodSugar)
        medicalLog.createdAt && createdAt.push(medicalLog.createdAt)

        medicalLog.symptoms.currentItems.map(symptom => {
          symptomsId.push(symptom.symptomId.toString())
        })
      })

      const symptomsNames = await Promise.all(
        symptomsId.map(symptom => {
          if (symptom) {
            return this.getSymptomById.execute({ symptomId: symptom }).then(res => res.isRight() && res.value.symptom.name)
          } 
        })
      )

      return {
        bloodPressure,
        bloodSugar,
        heartRate,
        mood,
        hydratation,
        createdAt,
        symptomsNames,
      }
    }

    const data = await getData()

    const getBloodPressure = () => {
      const bloodPressure = data.bloodPressure.map(item => {
        const [sys, dia] = item.split('/')
        return {
          sys: Number(sys),
          dia: Number(dia)
        }
      })

      let acc = {
        sys: 0,
        dia: 0
      }

      bloodPressure.map(item => {
        acc.sys += item.sys
        acc.dia += item.dia
      })

      const averageSys = Number((acc.sys / bloodPressure.length).toFixed(0))
      const averageDia = Number((acc.dia / bloodPressure.length).toFixed(0))

      return {
        status: getBloodPressureStatus(averageSys, averageDia),
        average: `${averageSys}/${averageDia}`,
        systolicAverage: averageSys,
        diastolicAverage: averageDia,
        totalLogs: bloodPressure.length
      }
    }

    const getSymptoms = () => {
      const countSymptoms = data.symptomsNames.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {})

      return {
        countSymptoms,
        totalLogs: data.symptomsNames.length
      }
    }

    const getHydration = () => {
      if (data.hydratation.length) {
        const hydratationTotal = data.hydratation.reduce((acc, item) => acc + item, 0)
        return {
          averageLitersHydration: (hydratationTotal / data.hydratation.length), // !!!
          totalLogs: data.hydratation.length
        }
      }
      return null
      
    }

    const getHeartRate = () => {
      const averageHeartRate = data.heartRate.reduce((acc, item) => acc + item, 0)
      const minHeartRate = Math.min(...data.heartRate)
      const maxHeartRate = Math.max(...data.heartRate)

      return {
        averageHeartRate: (averageHeartRate / data.heartRate.length),
        minHeartRate,
        maxHeartRate,
        totalLogs: data.heartRate.length
      }
    }

    const getBloodSugar = () => {
      const bloodSugar = data.bloodSugar.reduce((acc, item) => acc + item, 0)
      const minBloodSugar = Math.min(...data.bloodSugar)
      const maxBloodSugar = Math.max(...data.bloodSugar)

      return {
        averageBloodSugar: (bloodSugar / data.bloodSugar.length),
        totalLogs: data.bloodSugar.length,
        minBloodSugar,
        maxBloodSugar
      }
    }

    const getMood = () => {
      const countHumor = data.mood.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {})

      return {
        countHumor,
        totalLogs: data.mood.length
      }
    }

    const getCreatedAt = () => {
      const dates = data.createdAt

      const timestamps = dates.map(d => d.getTime())
      const firstDate = Math.min(...timestamps)
      const lastDate = Math.max(...timestamps)

      const diffMs = Math.abs(firstDate - lastDate) 
      console.log(diffMs)

      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      return {
        firstDate: new Date(firstDate),
        lastDate: new Date(lastDate),
        diffDays,
        year: result.year,
        month: translateMonth(result.month),
        totalLogs: dates.length
      }
    }

    const formatedData = {
      bloodPressure: getBloodPressure(),
      symptoms: getSymptoms(),
      hydration: getHydration(),
      heartRate: getHeartRate(),
      mood: getMood(),
      bloodSugar: getBloodSugar(),
      timeRegistered: getCreatedAt()
    }

    const aiGeneratedMedicalReport = await this.gemini.generateMedicalReport(formatedData)

    return {
      dataToPdf: aiGeneratedMedicalReport
    }
  }
}

function getBloodPressureStatus(sys: number, dia: number) {
  // 1. Validar Hipotensão (Baixa)
  if (sys < 90 || dia < 60) {
    return "Hipotensão/Pressão Baixa"
  }

  // 2. Validar Hipertensão Estágio 3 (Crise)
  if (sys >= 180 || dia >= 110) {
    return "Hipertensão Estágio 3"
  }

  // 3. Validar Hipertensão Estágio 2
  if (sys >= 160 || dia >= 100) {
    return "Hipertensão Estágio 2"
  }

  // 4. Validar Hipertensão Estágio 1
  if (sys >= 140 || dia >= 90) {
    return "Hipertensão Estágio 1"
  }

  // 5. Validar Pré-Hipertensão
  if (sys >= 130 || dia >= 90) {
    return "Pré-Hipertensão"
  }

  // 6. Se não caiu em nenhum acima, é Normal
  return "Normal"
}

function translateMonth(monthInNumber:  number) {
  switch(monthInNumber) {
    case 1:
      return 'January'
    case 2:
      return 'February'
    case 3:
      return 'March'
    case 4:
      return 'April'
    case 5:
      return 'May'
    case 6:
      return 'June'
    case 7:
      return 'July'
    case 8:
      return 'August'
    case 9:
      return 'September'
    case 10:
      return 'October'
    case 11:
      return 'November'
    case 12:
      return 'December'
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