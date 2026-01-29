import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KnowledgeBaseService } from '../../../../libs/shared/services/knowledge-base.service';
import { LikeService } from '../../../../libs/shared/services/like.service';
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
          <div class="title-row">
            <h1>{{ getTitle() }}</h1>
            <div class="header-actions">
              <button 
                type="button" 
                class="reset-btn"
                (click)="resetFilters()"
                [disabled]="!hasActiveFilters()"
              >
                Reset filters
              </button>
            </div>
          </div>
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
                (search)="onQueryChange()"
                aria-label="Filter dictionary"
              />

              <label class="toggle">
                <input
                  type="checkbox"
                  [(ngModel)]="showLikedOnly"
                  (ngModelChange)="onShowLikedOnlyChange()"
                />
                <span>Liked only</span>
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

              <select
                class="type-select"
                [(ngModel)]="selectedTopic"
                (ngModelChange)="onTopicChange()"
                aria-label="Filter by topic"
              >
                <option value="">All topics</option>
                <option *ngFor="let t of topics; trackBy: trackByTopicId" [value]="t.id">{{ (t.emoji ? (t.emoji + ' ') : '') + t.name }}</option>
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
                  <ng-container *ngIf="getWordEmoji(word) as emoji">
                    <span class="emoji" aria-hidden="true">{{ emoji }}</span>
                  </ng-container>
                  <span 
                    class="lao" 
                    [class.missing]="!word.lao"
                    (click)="searchForWord(word.lao)"
                  >{{ word.lao || '—' }}</span>
                  <span class="badge" *ngIf="word.needs_translation">UNTRANSLATED</span>
                  <button
                    class="audio"
                    type="button"
                    (click)="togglePlay(word, 'female')"
                    [attr.aria-label]="(isPlaying(word, 'female') ? 'Stop female audio for ' : 'Play female audio for ') + (word.english || word.id)"
                  >
                    {{ isPlaying(word, 'female') ? '⏹ F' : '▶ F' }}
                  </button>
                  <button
                    class="audio"
                    type="button"
                    (click)="togglePlay(word, 'male')"
                    [attr.aria-label]="(isPlaying(word, 'male') ? 'Stop male audio for ' : 'Play male audio for ') + (word.english || word.id)"
                  >
                    {{ isPlaying(word, 'male') ? '⏹ M' : '▶ M' }}
                  </button>
                </div>
                <div class="right">
                  <button
                    type="button"
                    class="info-btn"
                    (click)="viewWordDetail(word.id)"
                    aria-label="View word details"
                  >
                    ℹ
                  </button>
                  <button
                    type="button"
                    class="like"
                    [class.liked]="likeService.isLiked('word:' + word.id)"
                    (click)="likeService.toggle('word:' + word.id)"
                    aria-label="Toggle like"
                  >
                    ★
                  </button>
                  <span class="rank" *ngIf="word.usage_rank">#{{ word.usage_rank }}</span>
                </div>
              </div>
              <div class="bottom">
                <span class="english" (click)="searchForWord(word.english)">{{ word.english }}</span>
                <span class="phonetic">{{ word.phonetic || word.pronunciation || '' }}</span>
              </div>
            </div>
          </div>

          <ng-template #empty>
            <p class="empty">No matches.</p>
            <a
              *ngIf="query.trim()"
              class="missing-word-btn"
              [href]="getMissingWordFeedbackUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report missing word: “{{ query.trim() }}”
            </a>
          </ng-template>

          <div class="footer-actions">
            <a
              class="feedback-btn"
              [href]="getFeedbackUrl()"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback
            </a>
          </div>
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

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .header-actions {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      flex: 0 0 auto;
    }

    h1 {
      font-size: 2rem;
      font-weight: 300;
      margin: 0;
    }

    .reset-btn {
      padding: 0.75rem 1.5rem;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      white-space: nowrap;
      transition: opacity 0.2s ease;
    }

    .reset-btn:hover:not(:disabled) {
      opacity: 0.85;
    }

    .reset-btn:disabled {
      background: #e5e5e5;
      color: #999;
      cursor: not-allowed;
    }

    /* feedback button styles live in global styles.css */

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

    .emoji {
      font-size: 1.6rem;
      line-height: 1;
      flex: 0 0 auto;
    }

    .right {
      display: inline-flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .lao {
      font-size: 1.7rem;
      line-height: 1.1;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .lao:hover:not(.missing) {
      color: #0066cc;
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
      font-weight: 500;
    }

    .audio:hover {
      border-color: #000;
      background: #f5f5f5;
    }

    .info-btn {
      appearance: none;
      background: none;
      border: 1px solid #e5e5e5;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      color: #666;
      transition: all 0.2s ease;
    }

    .info-btn:hover {
      border-color: #0066cc;
      color: #0066cc;
      background: #f0f7ff;
    }

    .like {
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      font-size: 1.5rem;
      line-height: 1;
      color: #ddd;
      transition: color 0.2s ease;
    }

    .like:hover {
      color: #ffa500;
    }

    .like.liked {
      color: #ff6b00;
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
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .english:hover {
      color: #0066cc;
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

    .missing-word-btn {
      display: inline-block;
      margin-top: 0.75rem;
      padding: 0.75rem 1.25rem;
      background: #fff;
      color: #111;
      border: 1px solid #e0e0e0;
      text-decoration: none;
      border-radius: 10px;
      font-size: 1rem;
      line-height: 1;
      transition: background 0.2s ease;
    }

    .missing-word-btn:hover {
      background: #f5f5f5;
    }
  `]
})
export class DictComponent implements OnInit, OnDestroy {
  query = '';
  selectedCategory = '';
  selectedTopic = '';
  showLikedOnly = false;
  vocabulary: VocabularyItem[] = [];
  filtered: VocabularyItem[] = [];
  categories: string[] = [];
  topics: Array<{ id: string; name: string; emoji?: string; words: string[] }> = [];
  visibleTotal = 0;

  private isUpdatingFromUrl = false;

  private audio: HTMLAudioElement | null = null;
  private playingId: string | null = null;
  private currentGender: 'male' | 'female' | null = null;

  constructor(
    private kbService: KnowledgeBaseService,
    public likeService: LikeService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Read initial query params
    this.route.queryParamMap.subscribe(params => {
      this.isUpdatingFromUrl = true;
      this.query = params.get('q') || '';
      this.selectedCategory = params.get('category') || '';
      this.selectedTopic = params.get('topic') || '';
      this.showLikedOnly = params.get('liked') === 'true';
      this.applyFilter();
      this.isUpdatingFromUrl = false;
    });

    this.kbService.getKnowledgeBase().subscribe(kb => {
      if (!kb) return;
      this.vocabulary = this.sortByUsage(this.kbService.getVocabulary());
      this.categories = this.buildCategories(this.vocabulary);
      this.topics = this.kbService.getTopics()
        .map(t => ({ id: t.id, name: t.name, emoji: t.emoji, words: t.words }))
        .sort((a, b) => a.name.localeCompare(b.name));
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  onQueryChange(): void {
    this.updateUrl();
    this.applyFilter();
  }

  onCategoryChange(): void {
    this.updateUrl();
    this.applyFilter();
  }

  onTopicChange(): void {
    this.updateUrl();
    this.applyFilter();
  }

  onShowLikedOnlyChange(): void {
    this.updateUrl();
    this.applyFilter();
  }

  resetFilters(): void {
    this.query = '';
    this.selectedCategory = '';
    this.selectedTopic = '';
    this.showLikedOnly = false;
    this.updateUrl();
    this.applyFilter();
  }

  hasActiveFilters(): boolean {
    return !!this.query || !!this.selectedCategory || !!this.selectedTopic || this.showLikedOnly;
  }

  searchForWord(lao: string | undefined): void {
    if (!lao) return;
    this.query = lao;
    this.updateUrl();
    this.applyFilter();
  }

  viewWordDetail(wordId: string): void {
    this.router.navigate(['/word', wordId]);
  }

  getWordEmoji(word: VocabularyItem): string {
    if (word.emoji) return word.emoji;

    const englishLower = (word.english || '').toLowerCase();
    if (!englishLower) return '';

    const emojiMap: Record<string, string> = {
      elephant: '🐘',
      horse: '🐴',
      dog: '🐕',
      cat: '🐈',
      fish: '🐟',
      bird: '🐦',
      tiger: '🐅',
      buffalo: '🐃',
      cow: '🐄',
      pig: '🐖',
      chicken: '🐔',
      duck: '🦆',
      monkey: '🐒',
      snake: '🐍',
      rice: '🍚',
      water: '💧',
      food: '🍽️',
      house: '🏠',
      car: '🚗',
      tree: '🌳',
      flower: '🌸',
      sun: '☀️',
      moon: '🌙',
      star: '⭐',
      rain: '🌧️',
      mountain: '⛰️',
      river: '🏞️',
      book: '📖',
      phone: '📱',
      computer: '💻',
      money: '💰',
      heart: '❤️',
      hand: '✋',
      eye: '👁️',
      ear: '👂',
      mouth: '👄',
      nose: '👃',
      good: '👍',
      bad: '👎',
      happy: '😊',
      sad: '😢',
      love: '❤️',
      beautiful: '🌺',
      hot: '🔥',
      cold: '❄️',
      big: '📏',
      small: '🔍',
      eat: '🍴',
      drink: '🥤',
      sleep: '😴',
      walk: '🚶',
      run: '🏃',
      work: '💼',
      school: '🏫',
      hospital: '🏥',
      market: '🏪',
      temple: '🛕',
      friend: '👥',
      family: '👨‍👩‍👧‍👦',
      baby: '👶',
      man: '👨',
      woman: '👩',
      boy: '👦',
      girl: '👧'
    };

    // Prefer exact match
    if (emojiMap[englishLower]) {
      return emojiMap[englishLower];
    }

    // Then partial match (handles e.g. "Love (Noun)")
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (englishLower.includes(key) || key.includes(englishLower)) {
        return emoji;
      }
    }

    return '';
  }

  getTitle(): string {
    const parts: string[] = [];
    
    if (this.showLikedOnly) {
      parts.push('Liked');
    }
    
    if (this.selectedTopic) {
      const topic = this.topics.find(t => t.id === this.selectedTopic);
      if (topic) {
        parts.push(topic.name);
      }
    }
    
    if (this.selectedCategory) {
      const categoryName = this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1);
      parts.push(categoryName);
    }
    
    if (parts.length === 0) {
      return 'Dictionary';
    }
    
    return parts.join(' - ');
  }

  getFeedbackUrl(): string {
    const base = 'https://github.com/robotnic/lao/issues/new';

    const titleContext = this.getTitle();
    const titleSuffix = titleContext && titleContext !== 'Dictionary' ? ` (${titleContext})` : '';
    const title = `Feedback: Dictionary${titleSuffix}`;

    const url = typeof window !== 'undefined' ? window.location.href : '';

    const lines: string[] = [];
    if (url) lines.push(`Link: ${url}`);

    const topic = this.selectedTopic
      ? this.topics.find(t => t.id === this.selectedTopic)
      : undefined;
    if (topic) {
      lines.push(`Topic: ${(topic.emoji ? topic.emoji + ' ' : '') + topic.name} (${topic.id})`);
    }
    if (this.selectedCategory) {
      lines.push(`Category: ${this.selectedCategory}`);
    }
    if (this.showLikedOnly) {
      lines.push('Liked only: yes');
    }

    lines.push('');
    lines.push('What is the problem? (write in Lao if possible)');
    lines.push('- [ ] I cannot find a word');
    lines.push('- [ ] Meaning is wrong');
    lines.push('- [ ] Lao spelling is wrong');
    lines.push('- [ ] Pronunciation is wrong');
    lines.push('- [ ] The page is confusing');
    lines.push('- [ ] Technical problem (app does not work)');
    lines.push('- [ ] Other');

    lines.push('');
    lines.push('What did you search for?');
    lines.push(this.query || '');

    lines.push('');
    lines.push('Your correction / suggestion:');
    lines.push('');

    lines.push('');
    lines.push('Example (optional):');
    lines.push('- Lao sentence:');
    lines.push('- English translation (optional):');

    const params = new URLSearchParams({
      title,
      body: lines.join('\n'),
      labels: 'bug,enhancement'
    });

    return `${base}?${params.toString()}`;
  }

  getMissingWordFeedbackUrl(): string {
    const base = 'https://github.com/robotnic/lao/issues/new';
    const missing = this.query.trim();

    const title = missing
      ? `Missing word: ${missing}`
      : 'Missing word in dictionary';

    const url = typeof window !== 'undefined' ? window.location.href : '';

    const lines: string[] = [];
    if (url) lines.push(`Link: ${url}`);

    const topic = this.selectedTopic
      ? this.topics.find(t => t.id === this.selectedTopic)
      : undefined;
    if (topic) {
      lines.push(`Topic: ${(topic.emoji ? topic.emoji + ' ' : '') + topic.name} (${topic.id})`);
    }
    if (this.selectedCategory) {
      lines.push(`Category: ${this.selectedCategory}`);
    }
    if (this.showLikedOnly) {
      lines.push('Liked only: yes');
    }

    lines.push('');
    lines.push('Missing word / phrase:');
    lines.push(missing || '');

    lines.push('');
    lines.push('If you know it, please add:');
    lines.push('- Lao spelling:');
    lines.push('- English meaning (optional):');
    lines.push('- Pronunciation (optional):');
    lines.push('- Lao example sentence (optional):');
    lines.push('- Where did you see/hear this word? (optional)');

    const params = new URLSearchParams({
      title,
      body: lines.join('\n'),
      labels: 'enhancement'
    });

    return `${base}?${params.toString()}`;
  }

  trackByString(_index: number, value: string): string {
    return value;
  }

  trackByTopicId(_index: number, topic: { id: string; name: string; emoji?: string; words: string[] }): string {
    return topic.id;
  }

  trackById(_index: number, item: VocabularyItem): string {
    return item.id;
  }

  isPlaying(word: VocabularyItem, gender: 'male' | 'female'): boolean {
    return !!this.playingId && this.playingId === word.id && this.currentGender === gender;
  }

  togglePlay(word: VocabularyItem, gender: 'male' | 'female'): void {
    if (this.isPlaying(word, gender)) {
      this.stopAudio();
      return;
    }

    this.playAudio(word, gender);
  }

  private updateUrl(): void {
    if (this.isUpdatingFromUrl) return;
    
    const queryParams: any = {};
    
    if (this.query) {
      queryParams.q = this.query;
    }
    
    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }

    if (this.selectedTopic) {
      queryParams.topic = this.selectedTopic;
    }
    
    if (this.showLikedOnly) {
      queryParams.liked = 'true';
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  private applyFilter(): void {
    const q = this.query.trim().toLowerCase();
    const selectedCategory = this.selectedCategory.trim().toLowerCase();

    const base = this.vocabulary;

    this.visibleTotal = base.length;
    this.categories = this.buildCategories(base);

    if (selectedCategory) {
      const exists = this.categories.some(c => c.trim().toLowerCase() === selectedCategory);
      if (!exists) this.selectedCategory = '';
    }

    // Get word IDs for selected topic
    const topicWordIds = this.selectedTopic
      ? new Set(this.topics.find(t => t.id === this.selectedTopic)?.words || [])
      : null;

    this.filtered = base.filter(w => {
      if (this.showLikedOnly && !this.likeService.isLiked('word:' + w.id)) {
        return false;
      }

      if (topicWordIds && !topicWordIds.has(w.id)) {
        return false;
      }

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

  private buildCategories(words: VocabularyItem[]): string[] {
    const set = new Set<string>();
    for (const w of words) {
      const c = (w.category || '').trim();
      if (c) set.add(c);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  private playAudio(word: VocabularyItem, gender: 'male' | 'female'): void {
    this.stopAudio();

    const baseHref = this.document.querySelector('base')?.getAttribute('href') || '/';
    const url = `${baseHref}assets/audio/${encodeURIComponent(word.id)}_${gender}.mp3`;
    const audio = new Audio(url);
    audio.preload = 'none';

    const clear = () => {
      if (this.audio === audio) {
        this.audio = null;
        this.playingId = null;
        this.currentGender = null;
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
    this.currentGender = gender;

    void audio.play().catch(() => {
      // e.g. browser autoplay policy or missing file
      clear();
    });
  }

  private stopAudio(): void {
    if (!this.audio) {
      this.playingId = null;
      this.currentGender = null;
      return;
    }

    try {
      this.audio.pause();
      this.audio.currentTime = 0;
    } finally {
      this.audio = null;
      this.playingId = null;
      this.currentGender = null;
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
