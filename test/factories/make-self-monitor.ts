import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SelfMonitor, SelfMonitorProps } from "@/domain/medical/enterprise/entities/self-monitor";

export function makeSelfMonitor(
  props?: Partial<SelfMonitorProps>,
): SelfMonitor {
  const selfMonitor = SelfMonitor.create(
    {
      accountId: new UniqueEntityID(),
      logInputs: {
        bloodPressure: false,
        bloodSugar: false,
        hydration: false,
        imc: false,
        mood: false,
        symptoms: false,
      },
      updatedAt: props?.updatedAt ?? new Date(),
      ...props,
    },
  );

  return selfMonitor;
}
