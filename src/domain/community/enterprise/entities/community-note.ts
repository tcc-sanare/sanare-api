import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { CommunityNoteRating } from "./community-note-rating"
import { CommunityNoteRatingList } from "./community-notes-rating-list"

export type RowStatus = 'ACTIVED' | 'DELETED'

export interface CommunityNoteProps {
    cause: string,
    status?: RowStatus,
    userId: string,
    postId: string,

    ratings: CommunityNoteRatingList
    createdAt: Date,
    updatedAt?: Date
}

export class CommunityNote extends Entity<CommunityNoteProps> {
    static create(
        props: Optional<CommunityNoteProps, 'createdAt' | 'status' | 'ratings'>,
        id?: UniqueEntityID
    ) {
        return new CommunityNote(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                ratings: props.ratings ?? new CommunityNoteRatingList([]),
                status: props.status ?? 'ACTIVED'
            },
            id ?? new UniqueEntityID()
        )
    }

    private update() {
        this.props.updatedAt = new Date()
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get cause() {
        return this.props.cause
    }
    
    set cause(cause: string) {
        this.props.cause = cause
        this.update()
    }

    get status() {
        return this.props.status
    }

    set status(status: RowStatus) {
        this.props.status = status
        this.update()
    }

    get userId() {
        return this.props.userId
    }

    get postId() {
        return this.props.postId
    }

    get ratings() {
        return this.props.ratings
    }

    set ratings(ratings: CommunityNoteRatingList) {
        this.props.ratings = ratings
        this.update()
    }

}