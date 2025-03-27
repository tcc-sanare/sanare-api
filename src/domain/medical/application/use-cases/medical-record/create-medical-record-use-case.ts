import { Either, left, right } from "@/core/either";
import { BloodType, MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";
import { MedicalRecordRepository } from "../../repositories/medical-record-repository";
import { Injectable } from "@nestjs/common";

interface CreateMedicalRecordUseCaseRequest {
  bloodType: BloodType;
  userId: string;
  allergies: string[];
  chronicDiseases: string[];

}

type CreateMedicalRecordUseCaseResponse = Either<
  null,
  {
    medicalRecord: MedicalRecord
  }
>;

@Injectable()
export class CreateMedicalRecordUseCase {
  constructor(
    private medicalRecordRepository: MedicalRecordRepository,
  ) {}

  async execute (
    data: CreateMedicalRecordUseCaseRequest
  ): Promise<CreateMedicalRecordUseCaseResponse> {
    const medicalRecord = MedicalRecord.create({
      bloodType: data.bloodType,
      userId: data.userId

    });

    try {
      await this.medicalRecordRepository.create(medicalRecord);

      return right({medicalRecord});
    } catch {
      return left(null);
    }
  }
}