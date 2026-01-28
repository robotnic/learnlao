import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KnowledgeBaseService } from '../../../../libs/shared/services/knowledge-base.service';
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
            <div class="topic-card" *ngFor="let topic of pinnedTopics" (click)="selectTopic(topic)">
              <h3>{{ topic.name }}</h3>
              <p>{{ topic.words.length + topic.phrases.length }} items</p>
            </div>
          </div>

          <section class="topic-index" *ngIf="topicIndexGroups.length > 0">
            <h2 class="topic-index-title">Topic index (A–Z)</h2>
            <div class="topic-index-groups">
              <section class="topic-index-group" *ngFor="let group of topicIndexGroups">
                <h3 class="topic-index-letter">{{ group.letter }}</h3>
                <ul class="topic-index-list">
                  <li class="topic-index-item" *ngFor="let name of group.topics">
                    <button type="button" class="topic-index-link" (click)="openTopicByName(name)">
                      {{ name }}
                    </button>
                  </li>
                </ul>
              </section>
            </div>
          </section>

          <div class="topic-detail" *ngIf="selectedTopic">
            <div class="detail-header">
              <h2>{{ selectedTopic.name }}</h2>
              <button class="close-btn" (click)="selectedTopic = null">×</button>
            </div>

            <div class="vocabulary-list" *ngIf="selectedTopic.words.length > 0">
              <h3>Words</h3>
              <div class="vocab-item" *ngFor="let wordId of selectedTopic.words">
                <ng-container *ngIf="getWord(wordId) as word">
                  <span class="lao">{{ word.lao }}</span>
                  <span class="english">{{ word.english }}</span>
                  <span class="pronunciation">{{ word.phonetic || word.pronunciation || '' }}</span>
                </ng-container>
              </div>
            </div>

            <div class="vocabulary-list" *ngIf="selectedTopic.phrases.length > 0">
              <h3>Phrases</h3>
              <div class="vocab-item" *ngFor="let phraseId of selectedTopic.phrases">
                <ng-container *ngIf="getPhrase(phraseId) as phrase">
                  <span class="lao">{{ phrase.lao }}</span>
                  <span class="english">{{ phrase.english }}</span>
                  <span class="pronunciation">{{ phrase.phonetic }}</span>
                </ng-container>
              </div>
            </div>
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

    .topic-index {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
    }

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
    }

    .topic-index-link:hover {
      color: #000;
      text-decoration: underline;
    }

    .topic-card {
      padding: 2rem;
      border: 1px solid #e5e5e5;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .topic-card:hover {
      border-color: #000;
      background: #fafafa;
    }

    .topic-card h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 400;
    }

    .topic-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .topic-detail {
      position: fixed;
      top: 0;
      right: 0;
      width: 500px;
      height: 100vh;
      background: white;
      border-left: 1px solid #e5e5e5;
      padding: 2rem;
      overflow-y: auto;
      box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e5e5;
    }

    .detail-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 400;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #666;
      line-height: 1;
      padding: 0;
      width: 2rem;
      height: 2rem;
    }

    .close-btn:hover {
      color: #000;
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

    .lao {
      font-size: 1.5rem;
      grid-column: 1 / -1;
    }

    .english {
      color: #000;
    }

    .pronunciation {
      color: #999;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .topic-detail {
        width: 100%;
      }
    }
  `]
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  selectedTopic: Topic | null = null;
  topicIndexGroups: Array<{ letter: string; topics: string[] }> = [];
  pinnedTopics: Topic[] = [];

  constructor(private kbService: KnowledgeBaseService) {}

  ngOnInit() {
    // Wait for knowledge base to load
    this.kbService.getKnowledgeBase().subscribe(kb => {
      if (kb) {
        this.topics = this.kbService.getTopics();
        this.pinnedTopics = this.topics
          .filter(t => !!t.pinned)
          .sort((a, b) => a.name.localeCompare(b.name));
        this.topicIndexGroups = this.buildTopicIndexGroups(this.topics.map(t => t.name));
      }
    });
  }

  private buildTopicIndexGroups(existingTopicNames: string[]): Array<{ letter: string; topics: string[] }> {
    const normalized = (value: string) => value.trim();
    const all = existingTopicNames.map(normalized).filter(Boolean);

    const uniqueSorted = Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));

    const groups = new Map<string, string[]>();
    for (const name of uniqueSorted) {
      const firstChar = name.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      const arr = groups.get(letter) ?? [];
      arr.push(name);
      groups.set(letter, arr);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, topics]) => ({ letter, topics }));
  }

  selectTopic(topic: Topic) {
    this.selectedTopic = topic;
  }

  openTopicByName(name: string) {
    const topic = this.topics.find(t => t.name === name);
    if (!topic) {
      console.warn('Topic not found:', name);
      return;
    }
    this.selectTopic(topic);
  }

  getWord(id: string) {
    const word = this.kbService.getVocabularyById(id);
    if (!word) {
      console.warn('Word not found:', id);
    }
    return word;
  }

  getPhrase(id: string) {
    const phrase = this.kbService.getPhraseById(id);
    if (!phrase) {
      console.warn('Phrase not found:', id);
    }
    return phrase;
  }
}
