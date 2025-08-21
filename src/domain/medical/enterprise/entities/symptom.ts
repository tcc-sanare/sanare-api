import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface SymptomProps{
    name: string,
    description?: string,

    createdAt: Date,
    updatedAt?: Date,
}

export class Symptom extends Entity<SymptomProps>{

    static create(
        props: Optional<SymptomProps, 'createdAt'>,
        id?: UniqueEntityID
    ) {
        const symptom = new Symptom(
        {
            ...props,
            createdAt: props.createdAt ?? new Date()
        }, 
        id ?? new UniqueEntityID()
    )
        return symptom
    }

    get name() {
        return this.props.name
    }

    set name(name: string) {
        this.props.name = name
        this.update()
    }

    get description() {
        return this.props.description
    }

    set description(description: string) {
        this.props.description = description
        this.update()
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.createdAt
    }

    private update() {
        return this.props.updatedAt = new Date()
    }
}
