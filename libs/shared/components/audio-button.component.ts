import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'playaudio',
  standalone: true,
  template: `
    <button (click)="togglePlayback()" [class.playing]="isPlaying" aria-label="Toggle Audio">
        @if (!isPlaying) {
      <svg  viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        }
        @if (isPlaying) {
      <svg  viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
        }
    </button>
  `,
  styles: [`
    button {
      width: 48px; height: 48px; border-radius: 50%; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; background: #ffffff; color: #1a1a1a;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); }
    button.playing { background: #1a1a1a; color: #ffffff; }
    svg { width: 24px; height: 24px; }
  `]
})
export class PlayAudioComponent implements OnDestroy {
  @Input() id!: string;
  isPlaying = false;
  private currentAudio: HTMLAudioElement | null = null;

  togglePlayback(): void {
    this.isPlaying ? this.stop() : this.play(this.id);
  }

  play(id: string, voice?: 'male' | 'female'): void {
    this.stop();

    // 1. Determine voice: check param -> then session -> then default
    const storedVoice = sessionStorage.getItem('voicetype') as 'male' | 'female';
    let selectedVoice = voice || storedVoice || 'female';

    // 2. Play audio
    this.currentAudio = new Audio(`https://robotnic.github.io/audiofiles/audio/${id}_${selectedVoice}.mp3`);
    this.currentAudio.onplay = () => this.isPlaying = true;
    this.currentAudio.onended = () => {
      this.isPlaying = false;
      // 3. Alter voice for NEXT time only if it was an automatic toggle
      if (!voice) {
        const nextVoice = selectedVoice === 'male' ? 'female' : 'male';
        sessionStorage.setItem('voicetype', nextVoice);
      }
    };
    this.currentAudio.onerror = () => (this.isPlaying = false);
    this.currentAudio.play().catch(() => (this.isPlaying = false));
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
