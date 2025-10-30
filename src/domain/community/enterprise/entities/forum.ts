import { Entity } from "@/core/entities/entity";
import { Post, RowStatus } from "./post";
import { Optional } from "@/core/types/optional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { StoragedFile } from "@/core/entities/storaged-file";
import { ForumSaveList } from "./forum-save-list";

export interface ForumProps {
    body: string;
    link: string;
    imageKey: StoragedFile | null;
    status: RowStatus;
    posts?: Post[];
    saves: ForumSaveList

    createdAt: Date;
    updatedAt?: Date;
}

export class Forum extends Entity<ForumProps> {
    static create(
        props: Optional<ForumProps, 'createdAt' | 'status' | 'saves'>,
        id?: UniqueEntityID
    ) {
        return new Forum(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                saves: props.saves ?? new ForumSaveList([]),
                status: props.status ?? 'ACTIVED'
            },
            id ?? new UniqueEntityID(),
        )
    }

    private update() {
        this.props.updatedAt = new Date()
    }

    get body() {
        return this.props.body
    }

    set body(body: string) {
        this.props.body = body
        this.update()
    }

    get link() {
        return this.props.link
    }

    set link(link: string) {
        this.props.link = link
        this.update()
    }

    get imageKey() {
        return this.props.imageKey
    }

    set imageKey(imageKey: StoragedFile | null) {
        this.props.imageKey = imageKey
        this.update()
    }

    get status() {
        return this.props.status
    }

    set status(status: RowStatus) {
        this.props.status = status
        this.update()
    }

    get posts() {
        return this.props.posts
    }

    set posts(posts: Post[]) {
        this.props.posts = posts
        this.update()
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get saves() {
        return this.props.saves
    }

    set saves(postSaves: ForumSaveList) {
        this.saves = postSaves
        this.update()
    }
}