import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { AggregateRoot } from "@/core/entities/aggregate-root"
import { CommunityNote } from "./community-note"

export type RowStatus = 'ACTIVED' | 'DELETED'

export interface PostProps{
    body: string,
    status?: 'ACTIVED' | 'DELETED',

    userId: string,
    parentId?: string,
    forumId: string,

    createdAt: Date,
    updatedAt?: Date,

    childPosts: Post[],
    notes: CommunityNote[]
}

export class Post extends AggregateRoot<PostProps>{
    static create(
        props: Optional<PostProps, 'createdAt' | 'status' |'childPosts' | 'notes'>,
        id?: UniqueEntityID
    ) {
        return new Post(
            {
                ...props,
                createdAt: props.createdAt ?? new Date,
                status: props.status ?? 'ACTIVED',
                childPosts: props.childPosts ?? [],
                notes: props.notes ?? []
            }, id ?? new UniqueEntityID()
        )
    }

    private update() {
        this.props.updatedAt = new Date()
    }

    get body() {
        return this.props.body
    }

    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }

    set body(body: string) {
        this.props.body = body
        this.update()
    }

    get status() {
        return this.props.status
    }

    set status(status: 'ACTIVED' | 'DELETED') {
        this.props.status = status
        this.update()
    }

    get userId() {
        return this.props.userId
    }

    get parentId() {
        return this.props.parentId
    }

    get forumId() {
        return this.props.forumId
    }

    get childPosts() {
        return this.props.childPosts
    }

    set childPosts(childPosts: Post[]) {
        this.childPosts = childPosts
        this.update()
    }
    
    get notes() {
        return this.props.notes
    }

    set notes(communityNotes: CommunityNote[]) {
        this.notes = communityNotes
        this.update()
    }
}