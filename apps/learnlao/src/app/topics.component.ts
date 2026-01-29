import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KnowledgeBaseService } from '../../../../libs/shared/services/knowledge-base.service';
import { LikeService } from '../../../../libs/shared/services/like.service';
import { Topic } from '../../../../libs/shared/types/knowledge-base.types';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1>Topics</h1>
        </header>
        <main>
          <div class="topics-grid">
            <div class="topic-card" *ngFor="let topic of pinnedTopics" (click)="navigateToTopic(topic.id)">
              <div class="topic-card-header">
                <div class="topic-names">
                  <span class="topic-emoji" aria-hidden="true">{{ getTopicEmoji(topic.id) }}</span>
                  <div class="topic-text">
                    <div class="topic-lao">{{ topic.name_lao || topic.name }}</div>
                    <div class="topic-eng">{{ topic.name }}</div>
                  </div>
                </div>
                <button
                  type="button"
                  class="like"
                  [class.liked]="likeService.isLiked('topic:' + topic.id)"
                  (click)="onTopicLikeClick($event, topic.id)"
                  aria-label="Toggle like"
                >
                  ★
                </button>
              </div>
              <p>{{ topic.words.length + topic.phrases.length }} items</p>
            </div>
          </div>

          <section class="topic-index" *ngIf="topicIndexGroups.length > 0">
            <div class="topic-index-header">
              <h2 class="topic-index-title">Topic index ({{ sortByLao ? 'ກ-ຮ' : 'A–Z' }})</h2>
              <button type="button" class="sort-toggle" (click)="toggleLaoSort()">
                {{ sortByLao ? 'Sort by English' : 'ຈັດລຽງຕາມອັກษອນລາວ' }}
              </button>
            </div>
            <div class="topic-index-groups">
              <section class="topic-index-group" *ngFor="let group of topicIndexGroups">
                <h3 class="topic-index-letter">{{ group.letter }}</h3>
                <ul class="topic-index-list">
                  <li class="topic-index-item" *ngFor="let topic of group.topics">
                    <span class="topic-index-emoji" aria-hidden="true">{{ getTopicEmoji(topic.id) }}</span>
                    <button
                      type="button"
                      class="like"
                      [class.liked]="likeService.isLiked('topic:' + topic.id)"
                      (click)="onTopicIndexLikeClick($event, topic.id)"
                      aria-label="Toggle like"
                    >
                      ★
                    </button>
                    <button type="button" class="topic-index-link" (click)="openTopicById(topic.id)">
                      <div class="topic-index-text">
                        <div class="topic-index-lao">{{ topic.name_lao || topic.name }}</div>
                        <div class="topic-index-eng">{{ topic.name }}</div>
                      </div>
                    </button>
                  </li>
                </ul>
              </section>
            </div>
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
      max-width: 1000px;
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
      margin: 0 0 2rem 0;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .topics-grid .topic-card {
      animation: scaleInFade 0.4s ease-out;
      animation-fill-mode: both;
    }

    .topics-grid .topic-card:nth-child(1) { animation-delay: 0s; }
    .topics-grid .topic-card:nth-child(2) { animation-delay: 0.05s; }
    .topics-grid .topic-card:nth-child(3) { animation-delay: 0.1s; }
    .topics-grid .topic-card:nth-child(4) { animation-delay: 0.15s; }
    .topics-grid .topic-card:nth-child(5) { animation-delay: 0.2s; }
    .topics-grid .topic-card:nth-child(n+6) { animation-delay: 0.25s; }

    .topic-index {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
    }

    .topic-index-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .sort-toggle {
      appearance: none;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #333;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .sort-toggle:hover {
      border-color: #333;
      background: #f9f9f9;
    }

    .sort-toggle:active {
      background: #f0f0f0;
    }

    /* feedback button styles live in global styles.css */

    .topic-index-title {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 400;
      color: #666;
    }

    .topic-index-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .topic-index-letter {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
      letter-spacing: 0.02em;
    }

    .topic-index-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .topic-index-item {
      padding: 0.15rem 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .topic-index-emoji {
      font-size: 1em;
      line-height: 1;
      flex-shrink: 0;
    }

    .topic-index-item .like {
      font-size: 1rem;
      flex-shrink: 0;
    }

    .topic-index-link {
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      font: inherit;
      font-size: 0.8rem;
      line-height: 1.35;
      color: #666;
      text-align: left;
      flex: 1;
    }

    .topic-index-text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .topic-index-lao {
      font-size: 0.85rem;
      font-weight: 400;
    }

    .topic-index-eng {
      font-size: 0.75rem;
      color: #999;
    }

    .topic-index-link:hover {
      color: #000;
      text-decoration: underline;
    }

    @keyframes scaleInFade {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .topic-card {
      padding: 2rem;
      border: 1px solid #e5e5e5;
      cursor: pointer;
      transition: all 0.2s ease;
      animation: scaleInFade 0.4s ease-out;
    }

    .topic-card:hover {
      border-color: #000;
      background: #fafafa;
    }

    .topic-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .topic-names {
      display: flex;
      align-items: flex-start;
      gap: 0.8rem;
      flex: 1;
    }

    .topic-text {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .topic-lao {
      font-size: 1.25rem;
      font-weight: 400;
      line-height: 1.3;
    }

    .topic-eng {
      font-size: 0.95rem;
      color: #666;
      line-height: 1.3;
    }

    .topic-card h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 400;
      flex: 1;
      display: inline-flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .topic-emoji {
      font-size: 1em;
      line-height: 1;
      flex-shrink: 0;
    }

    .topic-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
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

    .topic-detail {
      width: 100%;
      min-height: calc(100vh - 8rem);
      background: white;
      padding: 0;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .detail-title h2 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 400;
    }

    .detail-subtitle {
      margin: 0.25rem 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .detail-header h2 {
      margin: 0;
    }

    .close-btn {
      appearance: none;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      color: #333;
      font-size: 0.9rem;
    }

    .close-btn:hover {
      border-color: #000;
    }

    .vocabulary-list {
      margin-bottom: 2rem;
    }

    .vocabulary-list h3 {
      font-size: 1.1rem;
      font-weight: 400;
      margin: 0 0 1rem 0;
      color: #666;
    }

    .vocab-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid #f0f0f0;
      margin-bottom: 0.5rem;
    }

    .vocab-top {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
    }

    .lao {
      font-size: 1.5rem;
    }

    .english {
      color: #000;
    }

    .pronunciation {
      color: #999;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .page {
        padding: 1rem;
      }
    }
  `]
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  topicIndexGroups: Array<{ letter: string; topics: Topic[] }> = [];
  pinnedTopics: Topic[] = [];
  sortByLao: boolean = false;

  constructor(
    private kbService: KnowledgeBaseService,
    private router: Router,
    public likeService: LikeService
  ) {}

  ngOnInit() {
    this.kbService.getKnowledgeBase().subscribe(kb => {
      if (kb) {
        this.topics = this.kbService.getTopics();
        this.updatePinnedTopics();
        this.topicIndexGroups = this.buildTopicIndexGroups(this.topics);
      }
    });
  }

  toggleLaoSort(): void {
    this.sortByLao = !this.sortByLao;
    this.topicIndexGroups = this.buildTopicIndexGroups(this.topics);
  }

  private buildTopicIndexGroups(topics: Topic[]): Array<{ letter: string; topics: Topic[] }> {
    const normalized = (value: string) => value.trim();
    
    if (this.sortByLao) {
      return this.buildLaoTopicIndexGroups(topics);
    }

    const topicsByName = topics.map(t => ({ ...t, searchName: normalized(t.name) })).filter(t => t.searchName);

    const uniqueSorted = Array.from(new Set(topicsByName.map(t => t.searchName)))
      .map(name => topicsByName.find(t => t.searchName === name)!)
      .sort((a, b) => a.name.localeCompare(b.name));

    const groups = new Map<string, Topic[]>();
    for (const topic of uniqueSorted) {
      const firstChar = topic.name.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      const arr = groups.get(letter) ?? [];
      arr.push(topic);
      groups.set(letter, arr);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, topics]) => ({ letter, topics }));
  }

  private buildLaoTopicIndexGroups(topics: Topic[]): Array<{ letter: string; topics: Topic[] }> {
    // Lao consonants in order
    const laoConsonants = [
      'ກ', 'ຂ', 'ຄ', 'ງ', 'ຈ', 'ສ', 'ຊ', 'ຍ', 'ດ', 'ຕ', 'ຖ', 'ທ', 'ນ', 'ບ', 'ປ', 'ຜ', 'ພ', 'ມ', 'ຢ', 'ຣ', 'ລ', 'ວ', 'ສ', 'ຫ', 'ອ'
    ];

    const groups = new Map<string, Topic[]>();

    for (const topic of topics) {
      const laoName = topic.name_lao || topic.name;
      const firstChar = laoName.trim().charAt(0);
      
      let letter = '#';
      const charIndex = laoConsonants.indexOf(firstChar);
      if (charIndex !== -1) {
        letter = firstChar;
      }

      const arr = groups.get(letter) ?? [];
      arr.push(topic);
      groups.set(letter, arr);
    }

    // Sort by Lao consonant order for consonants, '#' at end
    const sortedLetters = [
      ...laoConsonants.filter(c => groups.has(c)),
      ...(groups.has('#') ? ['#'] : [])
    ];

    return sortedLetters.map(letter => ({
      letter,
      topics: (groups.get(letter) ?? []).sort((a, b) => {
        const aLao = a.name_lao || a.name;
        const bLao = b.name_lao || b.name;
        return aLao.localeCompare(bLao, 'lo');
      })
    }));
  }

  navigateToTopic(id: string) {
    this.router.navigate(['/dict'], { queryParams: { topic: id } });
  }

  openTopicByName(name: string) {
    const topic = this.topics.find(t => t.name === name);
    if (!topic) {
      console.warn('Topic not found:', name);
      return;
    }
    this.navigateToTopic(topic.id);
  }

  openTopicById(topicId: string) {
    this.navigateToTopic(topicId);
  }

  onTopicLikeClick(event: Event, topicId: string): void {
    event.stopPropagation();
    this.likeService.toggle('topic:' + topicId);
    this.updatePinnedTopics();
  }

  onTopicIndexLikeClick(event: Event, topicId: string): void {
    event.stopPropagation();
    this.likeService.toggle('topic:' + topicId);
    this.updatePinnedTopics();
  }

  getTopicIdByName(name: string): string {
    const topic = this.topics.find(t => t.name === name);
    return topic?.id || '';
  }

  getTopicEmojiByName(name: string): string {
    const id = this.getTopicIdByName(name);
    return id ? this.getTopicEmoji(id) : '📌';
  }

  getTopicEmoji(topicId: string): string {
    const topic = this.topics.find(t => t.id === topicId);
    return topic?.emoji || '📌';
  }

  private updatePinnedTopics(): void {
    this.pinnedTopics = this.topics
      .filter(t => this.likeService.isLiked('topic:' + t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getFeedbackUrl(): string {
    const base = 'https://github.com/robotnic/lao/issues/new';
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const pinned = this.pinnedTopics
      .map((t) => `${t.emoji ? t.emoji + ' ' : ''}${t.name} (${t.id})`)
      .sort((a, b) => a.localeCompare(b));

    const lines: string[] = [];
    if (url) lines.push(`Link: ${url}`);
    lines.push(`Pinned topics: ${pinned.length === 0 ? '(none)' : ''}`);
    if (pinned.length > 0) {
      lines.push(...pinned.map((line) => `- ${line}`));
    }
    lines.push('');
    lines.push('What is the issue?');
    lines.push('- [ ] A topic is missing');
    lines.push('- [ ] A topic name/emoji is wrong');
    lines.push('- [ ] A word is missing in a topic');
    lines.push('- [ ] A word is in the wrong topic');
    lines.push('- [ ] Other');
    lines.push('');
    lines.push('Which topic? (name or id):');
    lines.push('');
    lines.push('Which word? (Lao or English, if relevant):');
    lines.push('');
    lines.push('Your correction / suggestion:');

    const params = new URLSearchParams({
      title: 'Feedback: Topics',
      body: lines.join('\n'),
      labels: 'bug,enhancement'
    });

    return `${base}?${params.toString()}`;
  }
}
