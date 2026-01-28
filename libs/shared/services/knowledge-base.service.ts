import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { KnowledgeBase, VocabularyItem, PhraseItem, Topic } from '../types/knowledge-base.types';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseService {
  private knowledgeBase$ = new BehaviorSubject<KnowledgeBase | null>(null);
  private loaded = false;

  constructor(private http: HttpClient) {}

  async loadKnowledgeBase(): Promise<void> {
    if (this.loaded) return;
    
    try {
      const kb = await firstValueFrom(
        this.http.get<KnowledgeBase>('/assets/knowledge_base.json')
      );
      this.knowledgeBase$.next(kb);
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
    }
  }

  getKnowledgeBase(): Observable<KnowledgeBase | null> {
    return this.knowledgeBase$.asObservable();
  }

  getKnowledgeBaseSync(): KnowledgeBase | null {
    return this.knowledgeBase$.value;
  }

  getVocabularyById(id: string): VocabularyItem | undefined {
    const kb = this.knowledgeBase$.value;
    return kb?.vocabulary?.find((v: VocabularyItem) => v.id === id);
  }

  getVocabulary(): VocabularyItem[] {
    const kb = this.knowledgeBase$.value;
    return kb?.vocabulary || [];
  }

  getPhraseById(id: string): PhraseItem | undefined {
    const kb = this.knowledgeBase$.value;
    return kb?.phrases?.find((p: PhraseItem) => p.id === id);
  }

  getTopics(): Topic[] {
    const kb = this.knowledgeBase$.value;
    return kb?.topics || [];
  }
}
