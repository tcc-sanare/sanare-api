import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { MedicalLog, MoodTypes } from "@/domain/medical/enterprise/entities/medical-log";
import { MedicalLogDisease } from "@/domain/medical/enterprise/entities/medical-log-disease";
import { MedicalLogDiseaseList } from "@/domain/medical/enterprise/entities/medical-log-disease-list";
import { MedicalLogSymptom } from "@/domain/medical/enterprise/entities/medical-log-symptom";
import { MedicalLogSymptomList } from "@/domain/medical/enterprise/entities/medical-log-symptom-list";
import { 
    Prisma,
    MedicalLogs as PrismaMedicalLog,
    MedicalLogsToDiseases as PrismaMedicalLogsToDiseases,
    MedicalLogsToSymptoms as PrismaMedicalLogsToSymptoms,
    MoodType as PrismaMoodType
} from "@prisma/client";

function moodTypeToDomain(moodType: PrismaMoodType): MoodTypes {
    switch (moodType) {
        case PrismaMoodType.CALM:
            return 'calm'
        case PrismaMoodType.HAPPY:
            return 'happy'
        case PrismaMoodType.ENERGIZED:
            return 'energized'
        case PrismaMoodType.ANGRY:
            return 'angry'
        case PrismaMoodType.LOW_ENERGY:
            return 'low-energy'
        case PrismaMoodType.DISORIENTED:
            return 'disoriented'
        case PrismaMoodType.DISCOURAGED:
            return 'discouraged'
        case PrismaMoodType.ANXIOUS:
            return 'anxious'
        case PrismaMoodType.MOOD_CHANGES:
            return 'mood-changes'
    }
}

function moodToPrisma(moodType: MoodTypes): PrismaMoodType {
    switch(moodType) {
        case 'calm':
            return PrismaMoodType.CALM;
        case 'happy':
            return PrismaMoodType.HAPPY;
        case 'energized':
            return PrismaMoodType.ENERGIZED;
        case 'angry':
            return PrismaMoodType.ANGRY;
        case 'low-energy':
            return PrismaMoodType.LOW_ENERGY;
        case 'disoriented':
            return PrismaMoodType.DISORIENTED;
        case 'discouraged':
            return PrismaMoodType.DISCOURAGED;
        case 'anxious':
            return PrismaMoodType.ANXIOUS;
        case 'mood-changes':
            return PrismaMoodType.MOOD_CHANGES;
    }
}

export class PrismaMedicalLogMapper {
    static toDomain(raw: PrismaMedicalLog & {
        diseases: PrismaMedicalLogsToDiseases[],
        symptoms: PrismaMedicalLogsToSymptoms[]
    }) : MedicalLog {
        return MedicalLog.create({
            selfMonitorId: raw.selfMonitorId ? new UniqueEntityID(raw.selfMonitorId) : undefined,

            diseases: new MedicalLogDiseaseList(raw.diseases.map(medicalLogToDisease => MedicalLogDisease.create({
                diseaseId: new UniqueEntityID(medicalLogToDisease.diseaseId),
                medicalLogId: new UniqueEntityID(medicalLogToDisease.medicalLogId)
            }))),

            symptoms: new MedicalLogSymptomList(raw.symptoms.map(medicalLogToSymptom => MedicalLogSymptom.create({
                symptomId: new UniqueEntityID(medicalLogToSymptom.symptomId),
                medicalLogId: new UniqueEntityID(medicalLogToSymptom.medicalLogId)
            }))),

            bloodPressure: raw.bloodPressure,
            heartRate: raw.heartRate,
            hydratation: raw.hydration,
            bloodSugar: raw.bloodSugar,
            mood: moodTypeToDomain(raw.mood),
            createdAt: raw.createdAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(medicalLog: MedicalLog): Prisma.MedicalLogsUncheckedCreateInput {
        return {
            id: medicalLog.id.toString(),
            bloodPressure: medicalLog.bloodPressure,
            heartRate: medicalLog.hearthRate,
            mood: moodToPrisma(medicalLog.mood),
            hydration: medicalLog.hydratation,
            bloodSugar: medicalLog.bloodSugar,
            selfMonitorId: medicalLog.selfMonitorId.toString(),
        }
    }
}