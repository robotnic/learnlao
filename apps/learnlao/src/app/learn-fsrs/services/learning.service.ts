import { Injectable } from '@angular/core';
import { fsrs, Rating, Card, createEmptyCard, State, FSRS } from 'ts-fsrs';
import { db } from '../db/lao-database';
import { Vocabulary, Progress, Question } from '../types/learning.types';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private f: FSRS = fsrs();

  /**
   * Initializes the database with vocabulary words.
   * Filters and sorts by usage_rank to ensure correct entry order.
   */
  async seedData(words: Vocabulary[]): Promise<void> {
    const count = await db.vocab.count();
    if (count === 0) {
      const sortedWords = [...words].sort((a, b) => a.usage_rank - b.usage_rank);
      await db.vocab.bulkAdd(sortedWords);

      const initialProgress: Progress[] = sortedWords.map(word => ({
        ...createEmptyCard(new Date()),
        id: word.id,
      }));
      await db.progress.bulkAdd(initialProgress);
    }
  }

  /**
   * Selection Logic:
   * 1. Check for Overdue Review words (Due <= Now).
   * 2. If none, pick the highest priority 'New' word (by usage_rank).
   */
  async getNextQuestion(): Promise<Question | null> {
    const now = new Date();

    // 1. Try to get a word that is due for review
    const overdueCards = await db.progress
      .where('due')
      .below(now)
      .and(p => p.state !== State.New)
      .toArray();
    
    let nextProgress: Progress | null = null;
    if (overdueCards.length > 0) {
      overdueCards.sort((a, b) => {
        const aDue = a.due instanceof Date ? a.due : new Date(a.due);
        const bDue = b.due instanceof Date ? b.due : new Date(b.due);
        return aDue.getTime() - bDue.getTime();
      });
      nextProgress = overdueCards[0];
    }

    // 2. Fallback to the next 'New' word based on usage_rank
    if (!nextProgress) {
      const newCards = await db.progress.where('state').equals(State.New).toArray();
      if (newCards.length > 0) {
        const newIds = newCards.map(p => p.id);
        const vocabArray = await db.vocab
          .where('id').anyOf(newIds)
          .toArray();
        
        if (vocabArray.length > 0) {
          vocabArray.sort((a, b) => a.usage_rank - b.usage_rank);
          const bestVocab = vocabArray[0];
          nextProgress = newCards.find(p => p.id === bestVocab.id) || null;
        }
      }
    }

    if (!nextProgress) return null;

    const word = await db.vocab.get(nextProgress.id);
    if (!word) return null;

    // Build the Question object
    const distractors = await this.getDistractors(word.english);
    const choices = [...distractors, word.english].sort(() => 0.5 - Math.random());
    const voice = Math.random() > 0.5 ? 'male' : 'female';

    return {
      word,
      choices,
      audioUrl: `https://robotnic.github.io/audiofiles/audio/${word.id}_${voice}.mp3`

    };
  }

  /**
   * Processes the quiz result.
   * Correct -> Rating.Good (moves forward)
   * Wrong -> Rating.Again (resets stability, shows again in ~1 min)
   */
  async processResult(wordId: string, isCorrect: boolean): Promise<void> {
    const card = await db.progress.get(wordId);
    if (!card) return;

    const rating = isCorrect ? Rating.Good : Rating.Again;

    // FSRS handles the mathematics of the new intervals
    const schedulingCards = this.f.repeat(card, new Date());
    const newCard = schedulingCards[rating].card;

    await db.progress.put({
      ...newCard,
      id: wordId
    });
  }

  /**
   * Private helper to fetch 3 unique wrong answers (distractors).
   */
  private async getDistractors(correctEnglish: string): Promise<string[]> {
    const pool = await db.vocab
      .where('english')
      .notEqual(correctEnglish)
      .limit(50)
      .toArray();

    return pool
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(v => v.english);
  }

  /**
   * Get count of words due for review today.
   */
  async getReviewCountToday(): Promise<number> {
    const now = new Date();
    const dueToday = await db.progress
      .where('due')
      .below(now)
      .and(p => p.state !== State.New)
      .count();
    return dueToday;
  }

  /**
   * Get total number of 'New' words remaining.
   */
  async getNewWordsCount(): Promise<number> {
    return await db.progress.where('state').equals(State.New).count();
  }
}
