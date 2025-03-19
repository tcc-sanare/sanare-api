import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvents } from './domain-events';

class CustomAggregateCreated implements DomainEvents {
  public ocurredAt: Date;
  private aggregrate: CustomAggregate;

  constructor(aggregrate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregrate = aggregrate;
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregrate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregrate = new CustomAggregate(null);

    aggregrate.addDomainEvent(new CustomAggregateCreated(aggregrate));

    return aggregrate;
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackspy = vi.fn();

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackspy, CustomAggregateCreated.name);

    // Estou criando uma resposta mas SEM salvar no banco
    const aggregrate = CustomAggregate.create();

    // Estou assegurando que o evento foi criado porém Não foi disparado
    expect(aggregrate.domainEvents).toHaveLength(1);

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregrate.id);

    // O Subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackspy).toHaveBeenCalled();
    expect(aggregrate.domainEvents).toHaveLength(0);
  });
});
