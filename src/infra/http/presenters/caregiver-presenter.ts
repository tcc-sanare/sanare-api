import { Caregiver } from "@/domain/medical/enterprise/entities/caregiver";

export class CaregiverPresenter{
    static toHttp({
        id, 
        code,
        userId,
        createdAt,
        updatedAt
    }: Caregiver){

        return {
            id: id.toString(),
            code: code.toValue(),
            userId: userId.toValue(),
            createdAt,
            updatedAt
        }
    }
}