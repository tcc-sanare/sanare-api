import { Either } from "@/core/either";
import { BloodType, MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";
import { MedicalRecordRepository } from "../../repositories/medical-record-repository";

// interface CreateMedicalRecordUseCaseRequest {
//   bloodType: BloodType;
//   userId: string;
//   allergies: string[];
//   chronicDiseases: string[];

// }

// type CreateMedicalRecordUseCaseRequest = Either<
//   null,
//   {
//     medicalRecord: MedicalRecord
//   }
// >

export class CreateMedicalRecordUseCase {
  constructor(
    private medicalRecordRepository: MedicalRecordRepository,
    private storage: Storage,
  ) {}

  // async execute (
  //   data: CreateMedicalRecordUseCaseRequest
  // ): Promise<CreateMedicalRecordUseCase> {
    
  // }
}