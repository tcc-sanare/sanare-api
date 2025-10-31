import { CaregiverRequest } from "../../enterprise/entities/caregiver-request";

export abstract class CaregiverRequestRepository {
  abstract findByCaregiverId(caregiverId: string): Promise<CaregiverRequest[] | null>;
  abstract findBySelfMonitorId(selfMonitorId: string): Promise<CaregiverRequest[] | null>;
  abstract findById(caregiverRequestId: string): Promise<CaregiverRequest | null>;
  abstract save(caregiverRequest: CaregiverRequest): Promise<void>;
  abstract create(caregiverRequest: CaregiverRequest): Promise<void>;
  abstract delete(caregiverRequest: CaregiverRequest): Promise<void>;
}