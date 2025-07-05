import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface MedicalLogDiseaseProps{
    medicalLogId: UniqueEntityID,
    diseaseId: UniqueEntityID
}

export class MedicalLogDisease extends Entity<MedicalLogDiseaseProps> {
    static create (props: MedicalLogDiseaseProps, id?: UniqueEntityID) {
        const medicalLogDisease = new MedicalLogDisease(
            props,
            id ?? new UniqueEntityID()
        )
        return medicalLogDisease
    }

    get medicalLogId() {
        return this.props.medicalLogId
    }

    get diseaseId() {
        return this.props.diseaseId
    }

}