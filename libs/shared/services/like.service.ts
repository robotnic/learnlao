import { Injectable } from '@angular/core';

type LikesMap = Record<string, true>;

@Injectable({ providedIn: 'root' })
export class LikeService {
  private readonly storageKey = 'likes';
  private likes: LikesMap = this.load();

  isLiked(id: string): boolean {
    return !!this.likes[id];
  }

  toggle(id: string): boolean {
    if (this.likes[id]) {
      delete this.likes[id];
    } else {
      this.likes[id] = true;
    }
    this.save();
    return this.isLiked(id);
  }

  private load(): LikesMap {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? (parsed as LikesMap) : {};
    } catch {
      return {};
    }
  }

  private save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.likes));
    } catch {
      // ignore storage errors
    }
  }
}
