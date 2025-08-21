import { CaregiverRequest } from "@/domain/medical/enterprise/entities/caregiver-request";

export class CaregiverRequestPresenter {
  static toHTTP(caregiverRequest: CaregiverRequest) {
    return {
      id: caregiverRequest.id.toString(),
      caregiverId: caregiverRequest.caregiverId.toString(),
      selfMonitorId: caregiverRequest.selfMonitorId.toString(),
      status: caregiverRequest.status,
      createdAt: caregiverRequest.createdAt,
      updatedAt: caregiverRequest.updatedAt,
    }
  }
}