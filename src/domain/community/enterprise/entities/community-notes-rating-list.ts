import { WatchedList } from "@/core/entities/watched-list";
import { CommunityNoteRating } from "./community-note-rating";

export class CommunityNoteRatingList extends WatchedList<CommunityNoteRating> {
  compareItems(a: CommunityNoteRating, b: CommunityNoteRating): boolean {
     return a.userId.toString() === b.userId.toString() && a.noteId.toString() === b.noteId.toString() && a.rating === b.rating
  }
}