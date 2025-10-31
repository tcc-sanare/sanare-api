import { WatchedList } from "@/core/entities/watched-list";
import { ForumSave } from "./forum-save";

export class ForumSaveList extends WatchedList<ForumSave> {
  compareItems(a: ForumSave, b: ForumSave): boolean {
    // return a.postId.equals(b.postId) && a.userId.equals(b.userId)
    return true
  }
}