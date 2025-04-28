import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Caregiver, CaregiverProps } from "@/domain/medical/enterprise/entities/caregiver";
import { UniqueCaregiverCode } from "@/domain/medical/enterprise/entities/value-object/unique-caregiver-code";

export function makeCaregiver(
  override?: Partial<CaregiverProps>
): Caregiver {
  const caregiver = Caregiver.create({
    code: new UniqueCaregiverCode(),
    userId: new UniqueEntityID(),
    ...override
  });

  return caregiver;
}
