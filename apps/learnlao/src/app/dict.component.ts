import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KnowledgeBaseService } from '../../../../libs/shared/services/knowledge-base.service';
import { VocabularyItem } from '../../../../libs/shared/types/knowledge-base.types';

@Component({
  selector: 'app-dict',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1>Dictionary</h1>
        </header>
        <main>
          <div class="controls">
            <div class="filters">
              <input
                class="search"
                type="search"
                placeholder="Filter (Lao / English / phonetic)…"
                [(ngModel)]="query"
                (ngModelChange)="onQueryChange()"
                aria-label="Filter dictionary"
              />

              <label class="toggle">
                <input
                  type="checkbox"
                  [(ngModel)]="includeUntranslated"
                  (ngModelChange)="onIncludeUntranslatedChange()"
                />
                <span>Include untranslated</span>
              </label>

              <select
                class="type-select"
                [(ngModel)]="selectedCategory"
                (ngModelChange)="onCategoryChange()"
                aria-label="Filter by word type"
              >
                <option value="">All types</option>
                <option *ngFor="let c of categories; trackBy: trackByString" [value]="c">{{ c }}</option>
              </select>
            </div>
            <div class="meta">
              <span>{{ filtered.length }}</span>
              <span class="muted">/ {{ visibleTotal }}</span>
            </div>
          </div>

          <div class="list" *ngIf="filtered.length > 0; else empty">
            <div class="row" *ngFor="let word of filtered; trackBy: trackById">
              <div class="top">
                <div class="left">
                  <span class="lao" [class.missing]="!word.lao">{{ word.lao || '—' }}</span>
                  <span class="badge" *ngIf="word.needs_translation">UNTRANSLATED</span>
                  <button
                    class="audio"
                    type="button"
                    *ngIf="word.audio_key"
                    (click)="togglePlay(word)"
                    [attr.aria-label]="(isPlaying(word) ? 'Stop audio for ' : 'Play audio for ') + (word.english || word.id)"
                  >
                    {{ isPlaying(word) ? 'Stop' : 'Play' }}
                  </button>
                </div>
                <span class="rank" *ngIf="word.usage_rank">#{{ word.usage_rank }}</span>
              </div>
              <div class="bottom">
                <span class="english">{{ word.english }}</span>
                <span class="phonetic">{{ word.phonetic || word.pronunciation || '' }}</span>
              </div>
            </div>
          </div>

          <ng-template #empty>
            <p class="empty">No matches.</p>
          </ng-template>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #fff;
      padding: 2rem;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: #000;
    }

    h1 {
      font-size: 2rem;
      font-weight: 300;
      margin: 0;
    }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .filters {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      width: 100%;
    }

    .search {
      width: 100%;
      max-width: 520px;
      padding: 0.9rem 1rem;
      border: 1px solid #e5e5e5;
      outline: none;
      font-size: 1rem;
      border-radius: 10px;
    }

    .search:focus {
      border-color: #000;
    }

    .type-select {
      flex: 0 0 auto;
      padding: 0.85rem 0.9rem;
      border: 1px solid #e5e5e5;
      border-radius: 10px;
      background: #fff;
      font-size: 1rem;
      color: #000;
      outline: none;
      max-width: 200px;
    }

    .type-select:focus {
      border-color: #000;
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #333;
      font-size: 0.9rem;
      user-select: none;
      white-space: nowrap;
    }

    .toggle input {
      width: 16px;
      height: 16px;
      accent-color: #000;
    }

    .meta {
      color: #000;
      font-size: 0.95rem;
      min-width: 90px;
      text-align: right;
    }

    .muted {
      color: #999;
    }

    .list {
      display: grid;
      gap: 0.5rem;
    }

    .row {
      border: 1px solid #f0f0f0;
      padding: 1rem;
      border-radius: 12px;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 0.25rem;
    }

    .left {
      display: inline-flex;
      align-items: baseline;
      gap: 0.75rem;
      min-width: 0;
    }

    .lao {
      font-size: 1.7rem;
      line-height: 1.1;
    }

    .lao.missing {
      color: #bbb;
    }

    .badge {
      border: 1px solid #eee;
      background: #fafafa;
      color: #666;
      border-radius: 999px;
      padding: 0.2rem 0.55rem;
      font-size: 0.75rem;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .audio {
      border: 1px solid #e5e5e5;
      background: #fff;
      color: #000;
      border-radius: 999px;
      padding: 0.35rem 0.7rem;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
    }

    .audio:hover {
      border-color: #000;
    }

    .rank {
      color: #999;
      font-size: 0.9rem;
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      color: #333;
    }

    .english {
      color: #000;
    }

    .phonetic {
      color: #999;
      font-size: 0.95rem;
      text-align: right;
      white-space: nowrap;
    }

    .empty {
      color: #666;
      margin-top: 1rem;
    }
  `]
})
export class DictComponent implements OnInit, OnDestroy {
  query = '';
  selectedCategory = '';
  includeUntranslated = false;
  vocabulary: VocabularyItem[] = [];
  filtered: VocabularyItem[] = [];
  categories: string[] = [];
  visibleTotal = 0;

  private audio: HTMLAudioElement | null = null;
  private playingId: string | null = null;

  constructor(private kbService: KnowledgeBaseService) {}

  ngOnInit(): void {
    this.kbService.getKnowledgeBase().subscribe(kb => {
      if (!kb) return;
      this.vocabulary = this.sortByUsage(this.kbService.getVocabulary());
      this.categories = this.buildCategories(this.vocabulary);
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  onQueryChange(): void {
    this.applyFilter();
  }

  onCategoryChange(): void {
    this.applyFilter();
  }

  onIncludeUntranslatedChange(): void {
    this.applyFilter();
  }

  trackByString(_index: number, value: string): string {
    return value;
  }

  trackById(_index: number, item: VocabularyItem): string {
    return item.id;
  }

  isPlaying(word: VocabularyItem): boolean {
    return !!this.playingId && this.playingId === word.id;
  }

  togglePlay(word: VocabularyItem): void {
    if (!word.audio_key) return;

    if (this.isPlaying(word)) {
      this.stopAudio();
      return;
    }

    this.playAudio(word);
  }

  private applyFilter(): void {
    const q = this.query.trim().toLowerCase();
    const selectedCategory = this.selectedCategory.trim().toLowerCase();

    const base = this.includeUntranslated
      ? this.vocabulary
      : this.vocabulary.filter(w => !this.isUntranslated(w));

    this.visibleTotal = base.length;
    this.categories = this.buildCategories(base);

    if (selectedCategory) {
      const exists = this.categories.some(c => c.trim().toLowerCase() === selectedCategory);
      if (!exists) this.selectedCategory = '';
    }

    this.filtered = base.filter(w => {
      if (selectedCategory) {
        const wordCategory = (w.category || '').trim().toLowerCase();
        if (wordCategory !== selectedCategory) return false;
      }

      if (!q) return true;

      const lao = (w.lao || '').toLowerCase();
      const english = (w.english || '').toLowerCase();
      const phonetic = ((w.phonetic || w.pronunciation || '') as string).toLowerCase();
      const id = (w.id || '').toLowerCase();
      return lao.includes(q) || english.includes(q) || phonetic.includes(q) || id.includes(q);
    });
  }

  private isUntranslated(word: VocabularyItem): boolean {
    return (word as any).needs_translation === true;
  }

  private buildCategories(words: VocabularyItem[]): string[] {
    const set = new Set<string>();
    for (const w of words) {
      const c = (w.category || '').trim();
      if (c) set.add(c);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  private playAudio(word: VocabularyItem): void {
    if (!word.audio_key) return;

    this.stopAudio();

    const url = `/assets/audio/${encodeURIComponent(word.audio_key)}.mp3`;
    const audio = new Audio(url);
    audio.preload = 'none';

    const clear = () => {
      if (this.audio === audio) {
        this.audio = null;
        this.playingId = null;
      }
    };

    audio.addEventListener('ended', clear);
    audio.addEventListener('pause', clear);
    audio.addEventListener('error', () => {
      console.warn(`Failed to load audio: ${url}`);
      clear();
    });

    this.audio = audio;
    this.playingId = word.id;

    void audio.play().catch(() => {
      // e.g. browser autoplay policy or missing file
      clear();
    });
  }

  private stopAudio(): void {
    if (!this.audio) {
      this.playingId = null;
      return;
    }

    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } finally {
      this.audio = null;
      this.playingId = null;
    }
  }

  private sortByUsage(words: VocabularyItem[]): VocabularyItem[] {
    return [...words].sort((a, b) => {
      const ra = typeof a.usage_rank === 'number' ? a.usage_rank : Number.POSITIVE_INFINITY;
      const rb = typeof b.usage_rank === 'number' ? b.usage_rank : Number.POSITIVE_INFINITY;
      if (ra !== rb) return ra - rb;
      return (a.english || '').localeCompare(b.english || '');
    });
  }
}
