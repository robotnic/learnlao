import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardService } from '../../services/award.service';
import { AwardState, LevelProgress } from '../../types/award.types';
import { LearningActivity } from '../../types/learning.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit, OnDestroy {
  awardState: AwardState | null = null;
  lastActivity: LearningActivity | null = null;
  showFireworks = false;
  expandedSection: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private awardService: AwardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.awardService.awardState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: AwardState) => {
        console.log('🎯 Scoreboard received awardState update:');
        console.log('   weeklyProgress:', state.weeklyProgress);
        this.awardState = state;
        this.cdr.markForCheck();
      });

    this.awardService.activity$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activity: LearningActivity | null) => {
        if (activity) {
          this.lastActivity = activity;
          if (activity.result > 0.9) {
            this.triggerFireworks();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  triggerFireworks(): void {
    this.showFireworks = true;
    setTimeout(() => {
      this.showFireworks = false;
    }, 2000);
  }

  toggleSection(section: string): void {
    this.expandedSection = this.expandedSection === section ? null : section;
  }

  getAverageAccuracy(activities: LearningActivity[]): number {
    if (!activities || activities.length === 0) return 0;
    const sum = activities.reduce((acc, activity) => acc + activity.result, 0);
    return sum / activities.length;
  }

  getAccuracyClass(accuracy: number): string {
    if (accuracy > 0.95) return 'accuracy-excellent';
    if (accuracy > 0.85) return 'accuracy-good';
    if (accuracy > 0.7) return 'accuracy-ok';
    return 'accuracy-poor';
  }

  getUniqueActivities(activities: LearningActivity[]): any[] {
    if (!activities || activities.length === 0) return [];
    
    // Group by lessonId
    const grouped = new Map<string, LearningActivity[]>();
    
    activities.forEach(activity => {
      if (!grouped.has(activity.lessonId)) {
        grouped.set(activity.lessonId, []);
      }
      grouped.get(activity.lessonId)!.push(activity);
    });
    
    // Create summary for each unique lesson
    return Array.from(grouped.entries()).map(([lessonId, activityGroup]) => {
      const mostRecent = activityGroup[0]; // Recent activities list is already sorted newest first
      const avgAccuracy = this.getAverageAccuracy(activityGroup);
      const hasFinishedAndPassed = activityGroup.some(a => a.step === a.totalSteps && a.result === 1);
      
      // Find completed activity with duration
      const completedActivity = activityGroup.find(a => a.step === a.totalSteps && a.durationSeconds);
      const durationMinutes = completedActivity?.durationSeconds 
        ? (completedActivity.durationSeconds / 60).toFixed(1)
        : null;
      
      return {
        lessonId,
        title: mostRecent.title,
        timestamp: mostRecent.timestamp,
        timestampFormatted: new Date(mostRecent.timestamp! * 1000).toLocaleString(),
        avgAccuracy,
        hasFinishedAndPassed,
        durationMinutes,
        count: activityGroup.length
      };
    });
  }

  playVoiceFeedback(): void {
    // Simulate voice feedback
    const utterance = new SpeechSynthesisUtterance('Well done!');
    window.speechSynthesis.speak(utterance);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
