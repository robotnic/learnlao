/**
 * Knowledge Base Types
 * Represents the learning content structure from knowledge_base.json
 */

export interface KnowledgeBaseMeta {
  version: string;
  last_updated: string;
  base_language: string;
  target_language: string;
  description: string;
  total_characters: number;
  total_words: number;
  total_phrases: number;
  total_levels: number;
}

export interface Level {
  id: string;
  title: string;
  type: 'alphabet' | 'vocabulary' | 'phrase' | 'grammar' | 'reading' | 'listening';
  order: number;
  description: string;
}

export interface Sounds {
  sound_initial: string;
  sound_final: string;
}

export interface AlphabetItem {
  id: string;
  lao: string;
  name: string;
  name_lao: string;
  type: 'consonant' | 'vowel' | 'tone';
  class?: 'high' | 'mid' | 'low'; // For consonants
  sounds: Sounds;
  mnemonic: string;
  level_id: string;
  audio_key: string;
  image_key: string;
  mark_type?: string; // For vowels and tones
  mark_position?: string;
}

export interface VocabularyItem {
  id: string;
  lao: string;
  english: string;
  pronunciation: string;
  level_id: string;
  part_of_speech?: string;
  audio_key?: string;
  image_key?: string;
  example?: string;
}

export interface PhraseItem {
  id: string;
  lao: string;
  english: string;
  pronunciation: string;
  level_id: string;
  components: string[]; // Array of component IDs
  audio_key?: string;
  use_case?: string;
}

export interface KnowledgeBase {
  meta: KnowledgeBaseMeta;
  levels: Level[];
  alphabet: AlphabetItem[];
  vocabulary?: VocabularyItem[];
  phrases?: PhraseItem[];
}
