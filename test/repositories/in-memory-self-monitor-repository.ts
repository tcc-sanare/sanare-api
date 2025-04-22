import { SelfMonitorRepository } from '@/domain/medical/application/repositories/self-monitor-repository';
import { SelfMonitor } from '@/domain/medical/enterprise/entities/self-monitor';

export class InMemorySelfMonitorRepository implements SelfMonitorRepository {
  items: SelfMonitor[];

  constructor () {
    this.items = [];
  }

  async findById(id: string): Promise<SelfMonitor | null> {
    return this.items.find(item => item.id.toString() === id) || null;
  }

  async findByUserId(userId: string): Promise<SelfMonitor | null> {
    return this.items.find(item => item.userId.toString() === userId) || null;
  }

  async findByCaregiverId(caregiverId: string): Promise<SelfMonitor[] | null> {
    return this.items.filter(item => item.caregiverId.toString() === caregiverId) || null;
  }

  async create(selfMonitor: SelfMonitor): Promise<void> {
    this.items.push(selfMonitor);
  }

  async save(selfMonitor: SelfMonitor): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === selfMonitor.id.toString());

    if (index !== -1) {
      this.items[index] = selfMonitor;
    }
  }

  async delete(selfMonitor: SelfMonitor): Promise<void> {
    const index = this.items.findIndex(item => item.id.toString() === selfMonitor.id.toString());

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

}
