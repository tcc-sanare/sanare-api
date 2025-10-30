import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ForumSaveProps {
    userId: UniqueEntityID,
    forumId: UniqueEntityID,
    createdAt: Date
}

export class ForumSave extends Entity<ForumSaveProps> {
    static create(
        props: Optional<ForumSaveProps, 'createdAt'>,
        id?: UniqueEntityID
    ) {
        return new ForumSave(
            {
                ...props,
                createdAt: props.createdAt ?? new Date()
            }, id ?? new UniqueEntityID()
        )
    }

    get userId() {
        return this.props.userId
    }

    get forumId() {
        return this.props.forumId
    }

    get createdAt() {
        return this.props.createdAt
    }
}