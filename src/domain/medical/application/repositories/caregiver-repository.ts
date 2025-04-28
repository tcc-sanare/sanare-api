import { Caregiver } from "../../enterprise/entities/caregiver";
import { UniqueCaregiverCode } from "../../enterprise/entities/value-object/unique-caregiver-code";

export abstract class CaregiverRepository {
  abstract findById(id: string): Promise<Caregiver | null>;
  abstract findByUserId(userId: string): Promise<Caregiver | null>;
  abstract findByCaregiverCode(caregiverCode: UniqueCaregiverCode): Promise<Caregiver | null>;
  abstract create(caregiver: Caregiver): Promise<void>;
  abstract save(caregiver: Caregiver): Promise<void>;
  abstract delete(caregiver: Caregiver): Promise<void>;
}