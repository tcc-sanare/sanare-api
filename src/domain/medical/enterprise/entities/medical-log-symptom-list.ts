import { WatchedList } from "@/core/entities/watched-list";
import { MedicalLogSymptom } from "./medical-log-symptom";

export class MedicalLogSymptomList extends WatchedList<MedicalLogSymptom> {
    compareItems(a: MedicalLogSymptom, b: MedicalLogSymptom): boolean {
        return a.symptomId.equals(b.symptomId)
    }
}