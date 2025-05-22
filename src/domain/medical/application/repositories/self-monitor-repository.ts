import { SelfMonitor } from "../../enterprise/entities/self-monitor";

export abstract class SelfMonitorRepository {
  abstract findById(id: string): Promise<SelfMonitor | null>;
  abstract findByAccountId(userId: string): Promise<SelfMonitor | null>;
  abstract findByCaregiverId(caregiverId: string): Promise<SelfMonitor[] | null>;
  abstract create(selfMonitor: SelfMonitor): Promise<void>;
  abstract save(selfMonitor: SelfMonitor): Promise<void>;
  abstract delete(selfMonitor: SelfMonitor): Promise<void>;
}