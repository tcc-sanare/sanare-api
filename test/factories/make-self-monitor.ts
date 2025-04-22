import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SelfMonitor, SelfMonitorProps } from "@/domain/medical/enterprise/entities/self-monitor";

export function makeSelfMonitor(
  props?: Partial<SelfMonitorProps>,
): SelfMonitor {
  console.log("makeSelfMonitor", props);
  const selfMonitor = SelfMonitor.create(
    {
      userId: new UniqueEntityID(),
      updatedAt: props?.updatedAt ?? new Date(),
      ...props,
    },
  );

  return selfMonitor;
}
