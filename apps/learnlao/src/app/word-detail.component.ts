import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KnowledgeBaseService } from '../../../../libs/shared/services/knowledge-base.service';
import { LikeService } from '../../../../libs/shared/services/like.service';
import { VocabularyItem, PhraseItem } from '../../../../libs/shared/types/knowledge-base.types';

@Component({
  selector: 'app-word-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/dict" class="back-link">← Back to Dictionary</a>
        </header>

        <main *ngIf="word; else notFound">
          <div class="word-header">
            <div class="word-main">
              <div class="word-title">
                <span class="lao">{{ word.lao }}</span>
                <span class="emoji" *ngIf="emoji">{{ emoji }}</span>
              </div>
              <button
                type="button"
                class="like"
                [class.liked]="likeService.isLiked('word:' + word.id)"
                (click)="likeService.toggle('word:' + word.id)"
                aria-label="Toggle like"
              >
                ★
              </button>
            </div>
            <div class="word-info">
              <p class="english">{{ word.english }}</p>
              <p class="phonetic" *ngIf="word.phonetic || word.pronunciation">
                {{ word.phonetic || word.pronunciation }}
              </p>
              <p class="category" *ngIf="word.category">{{ word.category }}</p>
            </div>
          </div>

          <section class="phrases-section" *ngIf="relatedPhrases.length > 0">
            <h2>Phrases containing this word</h2>
            <div class="phrase-list">
              <div class="phrase-item" *ngFor="let phrase of relatedPhrases">
                <div class="phrase-lao">{{ phrase.lao }}</div>
                <div class="phrase-english">{{ phrase.english }}</div>
                <div class="phrase-phonetic" *ngIf="phrase.phonetic">{{ phrase.phonetic }}</div>
              </div>
            </div>
          </section>

          <section class="no-phrases" *ngIf="relatedPhrases.length === 0">
            <p>No phrases found containing this word.</p>
          </section>

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

        <ng-template #notFound>
          <div class="not-found">
            <p>Word not found.</p>
            <a routerLink="/dict" class="back-btn">Return to Dictionary</a>
          </div>
        </ng-template>
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
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-block;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: #000;
    }

    .word-header {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .word-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .word-title {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .lao {
      font-size: 3rem;
      font-weight: 300;
      line-height: 1.2;
    }

    .emoji {
      font-size: 3rem;
    }

    .like {
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      font-size: 2rem;
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

    .word-info {
      margin-top: 1rem;
    }

    .english {
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
      color: #000;
    }

    .phonetic {
      font-size: 1.1rem;
      margin: 0 0 0.5rem 0;
      color: #666;
    }

    .category {
      display: inline-block;
      background: #f0f0f0;
      padding: 0.3rem 0.8rem;
      border-radius: 999px;
      font-size: 0.85rem;
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .phrases-section h2 {
      font-size: 1.25rem;
      font-weight: 400;
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .phrase-list {
      display: grid;
      gap: 1rem;
    }

    .phrase-item {
      padding: 1.25rem;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fafafa;
    }

    .phrase-lao {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .phrase-english {
      color: #000;
      margin-bottom: 0.25rem;
    }

    .phrase-phonetic {
      color: #666;
      font-size: 0.9rem;
    }

    .no-phrases {
      padding: 2rem;
      text-align: center;
      color: #666;
    }

    .not-found {
      padding: 3rem 0;
      text-align: center;
    }

    .not-found p {
      font-size: 1.25rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .back-btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #000;
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      transition: opacity 0.2s ease;
    }

    .back-btn:hover {
      opacity: 0.85;
    }

    /* feedback button styles live in global styles.css */
  `]
})
export class WordDetailComponent implements OnInit {
  word: VocabularyItem | null = null;
  relatedPhrases: PhraseItem[] = [];
  emoji: string = '';
  private wordId: string = '';

  constructor(
    private route: ActivatedRoute,
    private kbService: KnowledgeBaseService,
    public likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.wordId = id;
        this.loadWordDetails();
      }
    });

    this.kbService.getKnowledgeBase().subscribe(kb => {
      if (kb && this.wordId) {
        this.loadWordDetails();
      }
    });
  }

  private loadWordDetails(): void {
    this.word = this.kbService.getVocabularyById(this.wordId) || null;
    
    if (!this.word) {
      return;
    }

    // Find phrases containing this word
    this.relatedPhrases = this.findRelatedPhrases(this.word);

    // Find matching emoji
    this.emoji = this.findEmoji(this.word);
  }

  private findRelatedPhrases(word: VocabularyItem): PhraseItem[] {
    const kb = this.kbService.getKnowledgeBaseSync();
    const allPhrases = kb?.phrases || [];
    const laoWord = word.lao?.toLowerCase() || '';
    const englishWord = word.english?.toLowerCase() || '';

    if (!laoWord && !englishWord) {
      return [];
    }

    return allPhrases.filter((phrase: PhraseItem) => {
      const phraseLao = phrase.lao?.toLowerCase() || '';
      const phraseEnglish = phrase.english?.toLowerCase() || '';
      
      // Check if the word appears in the phrase
      const inLao = laoWord && phraseLao.includes(laoWord);
      const inEnglish = englishWord && phraseEnglish.split(/\s+/).some((w: string) => 
        w.replace(/[.,!?;:]/, '') === englishWord
      );
      
      return inLao || inEnglish;
    });
  }

  private findEmoji(word: VocabularyItem): string {
    if (word.emoji) return word.emoji;

    const englishLower = word.english?.toLowerCase() || '';
    
    // Simple emoji mapping based on common words
    const emojiMap: Record<string, string> = {
      'elephant': '🐘',
      'horse': '🐴',
      'dog': '🐕',
      'cat': '🐈',
      'fish': '🐟',
      'bird': '🐦',
      'tiger': '🐅',
      'buffalo': '🐃',
      'cow': '🐄',
      'pig': '🐖',
      'chicken': '🐔',
      'duck': '🦆',
      'monkey': '🐒',
      'snake': '🐍',
      'rice': '🍚',
      'water': '💧',
      'food': '🍽️',
      'house': '🏠',
      'car': '🚗',
      'tree': '🌳',
      'flower': '🌸',
      'sun': '☀️',
      'moon': '🌙',
      'star': '⭐',
      'rain': '🌧️',
      'mountain': '⛰️',
      'river': '🏞️',
      'book': '📖',
      'phone': '📱',
      'computer': '💻',
      'money': '💰',
      'heart': '❤️',
      'hand': '✋',
      'eye': '👁️',
      'ear': '👂',
      'mouth': '👄',
      'nose': '👃',
      'good': '👍',
      'bad': '👎',
      'happy': '😊',
      'sad': '😢',
      'love': '❤️',
      'beautiful': '🌺',
      'hot': '🔥',
      'cold': '❄️',
      'big': '📏',
      'small': '🔍',
      'eat': '🍴',
      'drink': '🥤',
      'sleep': '😴',
      'walk': '🚶',
      'run': '🏃',
      'work': '💼',
      'school': '🏫',
      'hospital': '🏥',
      'market': '🏪',
      'temple': '🛕',
      'friend': '👥',
      'family': '👨‍👩‍👧‍👦',
      'baby': '👶',
      'man': '👨',
      'woman': '👩',
      'boy': '👦',
      'girl': '👧',
    };

    // Check for exact match first
    if (emojiMap[englishLower]) {
      return emojiMap[englishLower];
    }

    // Check for partial matches
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (englishLower.includes(key) || key.includes(englishLower)) {
        return emoji;
      }
    }

    return '';
  }

  getFeedbackUrl(): string {
    const base = 'https://github.com/robotnic/lao/issues/new';

    const title = this.word
      ? `Feedback: ${this.word.english || this.word.id} (${this.word.id})`
      : 'Feedback: word page';

    const url = (typeof window !== 'undefined' && window.location)
      ? window.location.href
      : '';

    const lines: string[] = [];
    if (url) lines.push(`Link: ${url}`);

    if (this.word) {
      lines.push(`Word: ${this.word.lao} — ${this.word.english || ''}`);
      if (this.emoji) {
        lines.push(`Emoji: ${this.emoji}`);
      }
    }

    lines.push('');
    lines.push('What is the problem? (write in Lao if possible)');
    lines.push('- [ ] Meaning is wrong');
    lines.push('- [ ] Lao spelling is wrong');
    lines.push('- [ ] Pronunciation is wrong');
    lines.push('- [ ] Missing example phrase');
    lines.push('- [ ] Emoji is wrong');
    lines.push('- [ ] Technical problem (app does not work)');
    lines.push('- [ ] Other');

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
}
