import { 
  Prisma, 
  MedicalRecord as PrismaMedicalRecord, 
  BloodType as PrismaBloodType, 
  MedicalRecordToAllergies as PrismaMedicalRecordToAllergies, 
  MedicalRecordToChronicDiseases as PrismaMedicalRecordToChronicDisease,
} from "@prisma/client";
import { BloodType, MedicalRecord } from "@/domain/medical/enterprise/entities/medical-record";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { MedicalRecordAllergyList } from "@/domain/medical/enterprise/entities/medical-record-allergy-list";
import { MedicalRecordAllergy } from "@/domain/medical/enterprise/entities/medical-record-allergy";
import { MedicalRecordChronicDiseaseList } from "@/domain/medical/enterprise/entities/medical-record-chronic-disease-list";
import { MedicalRecordChronicDisease } from "@/domain/medical/enterprise/entities/medical-record-chronic-disease";

function bloodTypeToDomain(bloodType: PrismaBloodType): BloodType {
  switch (bloodType) {
    case PrismaBloodType.A_MINUS:
      return 'a-';
    case PrismaBloodType.A_PLUS:
      return 'a+';
    case PrismaBloodType.B_MINUS:
      return 'b-';
    case PrismaBloodType.B_PLUS:
      return 'b+';
    case PrismaBloodType.AB_MINUS:
      return 'ab-';
    case PrismaBloodType.AB_PLUS:
      return 'ab+';
    case PrismaBloodType.O_MINUS:
      return 'o-';
    case PrismaBloodType.O_PLUS:
      return 'o+';
  }
}

function bloodTypeToPrisma(bloodType: BloodType): PrismaBloodType {
  switch (bloodType) {
    case 'a-':
      return PrismaBloodType.A_MINUS;
    case 'a+':
      return PrismaBloodType.A_PLUS;
    case 'b-':
      return PrismaBloodType.B_MINUS;
    case 'b+':
      return PrismaBloodType.B_PLUS;
    case 'ab-':
      return PrismaBloodType.AB_MINUS;
    case 'ab+':
      return PrismaBloodType.AB_PLUS;
    case 'o-':
      return PrismaBloodType.O_MINUS;
    case 'o+':
      return PrismaBloodType.O_PLUS
  }
}

export class PrismaMedicalRecordMapper {
  static toDomain(raw: PrismaMedicalRecord & {
    allergies: PrismaMedicalRecordToAllergies[];
    chronicDiseases: PrismaMedicalRecordToChronicDisease[];
  }): MedicalRecord {
    return MedicalRecord.create({
      selfMonitorId: raw.selfMonitorId ? new UniqueEntityID(raw.selfMonitorId) : undefined,
      bloodType: bloodTypeToDomain(raw.bloodType),
      allergies: new MedicalRecordAllergyList(raw.allergies.map(medicalRecordToAllergy => MedicalRecordAllergy.create({
        allergyId: new UniqueEntityID(medicalRecordToAllergy.allergyId),
        medicalRecordId: new UniqueEntityID(medicalRecordToAllergy.medicalRecordId),
      }))),
      chronicDiseases: new MedicalRecordChronicDiseaseList(raw.chronicDiseases.map(medicalRecordToChronicDisease => MedicalRecordChronicDisease.create({
        chronicDiseaseId: new UniqueEntityID(medicalRecordToChronicDisease.chronicDiseaseId),
        medicalRecordId: new UniqueEntityID(medicalRecordToChronicDisease.medicalRecordId),
      }))),
    }, new UniqueEntityID(raw.id));
  }

  static toPrisma(medicalRecord: MedicalRecord): Prisma.MedicalRecordUncheckedCreateInput {
    return {
      id: medicalRecord.id.toString(),
      selfMonitorId: medicalRecord.selfMonitorId?.toString(),
      bloodType: bloodTypeToPrisma(medicalRecord.bloodType),
    };
  }
}