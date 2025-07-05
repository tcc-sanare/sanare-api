import { WatchedList } from "@/core/entities/watched-list";
import { MedicalLogDisease } from "./medical-log-disease";

export class MedicalLogDiseaseList extends WatchedList<MedicalLogDisease> {
    compareItems(a: MedicalLogDisease, b: MedicalLogDisease): boolean {
        return a.diseaseId.equals(b.diseaseId)
    }
}