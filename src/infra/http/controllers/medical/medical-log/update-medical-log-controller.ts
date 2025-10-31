import { GetMedicalLogByIdUseCase } from '@/domain/medical/application/use-cases/medical-log/get-medical-log-by-id-use-case';
import { UpdateMedicalLogUseCase } from '@/domain/medical/application/use-cases/medical-log/update-medical-log-use-case';
import { CustomHttpException } from '@/infra/http/exceptions/custom-http-exception';
import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const bodySchema = z.object({
  bloodPressure: z.string().optional(),
  heartRate: z.number().optional(),
  mood: z
    .enum([
      'calm',
      'happy',
      'energized',
      'angry',
      'low-energy',
      'disoriented',
      'discouraged',
      'anxious',
      'mood-changes',
    ])
    .optional(),
  hydratation: z.number().optional(),
  bloodSugar: z.number().optional(),
  diseases: z.string().array().optional(),
  symptoms: z.string().array().optional(),
});

const bodyValidationPipe = new ZodValidationPipe(bodySchema);
type BodyDto = z.infer<typeof bodySchema>;

@Controller('medical-log')
export class UpdateMedicalLogController {
  constructor(
    private updateMedicalLogUseCase: UpdateMedicalLogUseCase,
    private getMedicalLogById: GetMedicalLogByIdUseCase,
  ) {}

  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: BodyDto,
  ) {
    const medicalLog = await this.getMedicalLogById
      .execute({
        medicalLogId: id,
      })
      .then((res) => {
        if (res.isLeft()) throw new CustomHttpException(res.value);
        return res.value.medicalLog;
      });

    const result = await this.updateMedicalLogUseCase
      .execute({
        ...body,
        medicalLogId: medicalLog.id.toString(),
      })
      .then((res) => {
        if (res.isLeft()) throw new CustomHttpException(res.value);
        return res;
      });

    // return {
    //     medicalLog:
    // }

    return;
  }
}
