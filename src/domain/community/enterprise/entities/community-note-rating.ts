import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export type CommunityNoteRatingType = 'YES' | 'NO' | 'SOMEWHAT'

export interface CommunityNoteRatingProps {
    userId: UniqueEntityID,
    noteId: UniqueEntityID,
    rating: CommunityNoteRatingType
}

export class CommunityNoteRating extends Entity<CommunityNoteRatingProps> {
    static create(
        props: CommunityNoteRatingProps,
        id?: UniqueEntityID
    ) {
        return new CommunityNoteRating(
            {
                ...props
            },
            id ?? new UniqueEntityID()
        )
    }

    get userId() {
        return this.props.userId
    }

    get noteId() {
        return this.props.noteId
    }

    get rating() {
        return this.props.rating
    }
}

