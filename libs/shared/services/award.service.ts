import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LearningActivity } from '../../types/learning.types';
import { AwardState, LevelProgress, MedalCollection } from '../../types/award.types';

@Injectable({
  providedIn: 'root'
})
export class AwardService {
  private readonly awardStateSubject = new BehaviorSubject<AwardState>(this.getInitialState());
  public awardState$: Observable<AwardState> = this.awardStateSubject.asObservable();

  private activitySubject = new BehaviorSubject<LearningActivity | null>(null);
  public activity$: Observable<LearningActivity | null> = this.activitySubject.asObservable();

  private activitiesThisWeek: Map<number, number> = new Map(); // day -> count
  private timerStartTime: number | null = null; // Timestamp when timer started (for UI display)
  // Lesson stopwatch tracking - tracks cumulative active time only
  private lessonStopwatchTime: Map<string, number> = new Map(); // lessonId -> cumulative seconds of active work
  private lessonLastActivityTime: Map<string, number> = new Map(); // lessonId -> timestamp of last activity
  private readonly PAUSE_THRESHOLD_SECONDS = 300; // 5 minutes - gaps longer than this are considered pauses

  constructor() {
    this.initializeWeeklyTracking();
  }

  private initializeWeeklyTracking(): void {
    // Initialize activity counts for each day (0-6, 0=Monday)
    for (let i = 0; i < 7; i++) {
      this.activitiesThisWeek.set(i, 0);
    }
  }

  private getInitialState(): AwardState {
    return {
      currentLevel: 1,
      levelProgress: [
        { level: 1, itemsMastered: 0, totalItems: 120, percentComplete: 0 },
        { level: 2, itemsMastered: 0, totalItems: 120, percentComplete: 0 },
        { level: 3, itemsMastered: 0, totalItems: 120, percentComplete: 0 },
        { level: 4, itemsMastered: 0, totalItems: 120, percentComplete: 0 }
      ],
      recentActivities: [],
      currentStreak: 0,
      totalItemsMastered: 0,
      medals: {
        silver: 0,
        gold: 0,
        platinum: 0,
        master: 0
      },
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0], // Mon-Sun all at 0 for new user
      elapsedTimeSeconds: 0,
      isTimerRunning: false,
      pausedLessons: []
    };
  }

  receiveActivity(activity: LearningActivity): void {
    // Clamp step to totalSteps if it exceeds
    const clampedStep = Math.min(activity.step, activity.totalSteps);
    
    const activity_with_timestamp: LearningActivity = {
      ...activity,
      step: clampedStep,
      timestamp: activity.timestamp || Math.floor(Date.now() / 1000)
    };

    // Timer logic for UI display
    if (activity_with_timestamp.step === 0) {
      // Start timer on step 0
      this.timerStartTime = Date.now();
      console.log('⏱️ Timer started');
    }

    let elapsedSeconds = 0;
    let isTimerRunning = this.timerStartTime !== null;

    if (this.timerStartTime !== null) {
      elapsedSeconds = (Date.now() - this.timerStartTime) / 1000;
      
      if (activity_with_timestamp.step === activity_with_timestamp.totalSteps) {
        // Stop timer when activity completes
        console.log(`⏱️ Timer stopped: ${elapsedSeconds.toFixed(1)}s`);
        this.timerStartTime = null;
        isTimerRunning = false;
      }
    }

    // Lesson Stopwatch: Track cumulative active time (pauses automatically on gaps > 5 min)
    if (activity.step === 0) {
      // Start stopwatch - initialize at 0 seconds
      this.lessonStopwatchTime.set(activity.lessonId, 0);
      this.lessonLastActivityTime.set(activity.lessonId, activity_with_timestamp.timestamp!);
      console.log(`⏱️ Stopwatch started for: ${activity.title}`);
    } else if (this.lessonLastActivityTime.has(activity.lessonId)) {
      // Continue stopwatch - add elapsed time since last activity
      const lastActivityTime = this.lessonLastActivityTime.get(activity.lessonId)!;
      const elapsedSinceLastActivity = activity_with_timestamp.timestamp! - lastActivityTime;
      
      // Only count time if activities are close together (< 5 minutes = active work)
      // Longer gaps are considered pauses and not counted
      if (elapsedSinceLastActivity <= this.PAUSE_THRESHOLD_SECONDS) {
        const currentStopwatchTime = this.lessonStopwatchTime.get(activity.lessonId) || 0;
        const newStopwatchTime = currentStopwatchTime + elapsedSinceLastActivity;
        this.lessonStopwatchTime.set(activity.lessonId, newStopwatchTime);
        console.log(`⏱️ Stopwatch: +${elapsedSinceLastActivity}s → ${newStopwatchTime}s total`);
      } else {
        console.log(`⏸️ Pause detected (${elapsedSinceLastActivity}s gap) - stopwatch not incremented`);
      }
      
      this.lessonLastActivityTime.set(activity.lessonId, activity_with_timestamp.timestamp!);
    }

    // Stop stopwatch when lesson completes and store total active time
    if (activity.step === activity.totalSteps && this.lessonStopwatchTime.has(activity.lessonId)) {
      const totalActiveTime = this.lessonStopwatchTime.get(activity.lessonId)!;
      activity_with_timestamp.durationSeconds = totalActiveTime;
      console.log(`⏹️ Stopwatch stopped: ${activity.title} completed in ${totalActiveTime}s (${(totalActiveTime / 60).toFixed(1)} min active time)`);
      
      // Clear stopwatch data for this lesson
      this.lessonStopwatchTime.delete(activity.lessonId);
      this.lessonLastActivityTime.delete(activity.lessonId);
    }

    this.activitySubject.next(activity_with_timestamp);
    this.updateAwardState(activity_with_timestamp, elapsedSeconds, isTimerRunning);
    
    // Log activity with day of week calculated from timestamp (convert seconds to milliseconds)
    const activityDate = new Date(activity_with_timestamp.timestamp! * 1000);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[activityDate.getDay()];
    const dateTime = activityDate.toISOString();
    const resultIcon = activity.result === 1 ? '✓' : '✗';
    
    console.log(`📚 Activity Received: [${dateTime} - ${dayOfWeek}] ${activity.title} ${activity.path} L${activity.level} Step ${activity.step}/${activity.totalSteps} ${resultIcon}`);
  }

  private updateAwardState(activity: LearningActivity, elapsedTimeSeconds: number, isTimerRunning: boolean): void {
    const currentState = this.awardStateSubject.value;

    // Update level progress based on activity result
    const levelIndex = activity.level - 1;
    const levelProgress = [...currentState.levelProgress];
    
    if (activity.result > 0.8) {
      // Increment items mastered if accuracy > 80%
      levelProgress[levelIndex].itemsMastered = Math.min(
        levelProgress[levelIndex].itemsMastered + 1,
        levelProgress[levelIndex].totalItems
      );
      levelProgress[levelIndex].percentComplete = 
        (levelProgress[levelIndex].itemsMastered / levelProgress[levelIndex].totalItems) * 100;
    }

    // Update medals based on result
    const medals = { ...currentState.medals };
    if (activity.result > 0) medals.silver++;
    if (activity.result > 0.85) medals.gold++;
    if (activity.result > 0.95) medals.platinum++;
    if (activity.result > 0.99) medals.master++;

    // Update weekly progress using activity timestamp instead of current date (convert seconds to milliseconds)
    const activityDate = new Date((activity.timestamp || Math.floor(Date.now() / 1000)) * 1000);
    const dayOfWeek = activityDate.getDay(); // 0=Sunday, 6=Saturday
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to array index (0=Monday, 6=Sunday)
    const weeklyProgress = [...currentState.weeklyProgress];
    const oldValue = weeklyProgress[dayIndex];
    // Add 12 per activity (no cap, keeps growing)
    weeklyProgress[dayIndex] = weeklyProgress[dayIndex] + 12;
    
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    console.log(`📊 Weekly Progress Update:`);
    console.log(`   Day: ${dayNames[dayIndex]} (index: ${dayIndex})`);
    console.log(`   Activity: ${activity.title} L${activity.level}`);
    console.log(`   Before: ${oldValue}`);
    console.log(`   After: ${weeklyProgress[dayIndex]}`);
    console.log(`   Weekly Progress:`, weeklyProgress);

    // Get active lesson stopwatch info if there's one running
    let activeLessonStopwatch = undefined;
    if (this.lessonStopwatchTime.has(activity.lessonId)) {
      activeLessonStopwatch = {
        lessonId: activity.lessonId,
        lessonTitle: activity.title,
        elapsedSeconds: this.lessonStopwatchTime.get(activity.lessonId)!
      };
    }

    // Build list of paused lessons (lessons with stopwatch but not currently active)
    const pausedLessons: Array<{ lessonId: string; lessonTitle: string; elapsedSeconds: number; currentStep: number; totalSteps: number }> = [];
    this.lessonStopwatchTime.forEach((elapsedSeconds, lessonId) => {
      if (lessonId !== activity.lessonId) {
        // Find the most recent activity for this lesson
        const recentActivity = currentState.recentActivities.find((a: any) => a.lessonId === lessonId);
        if (recentActivity) {
          pausedLessons.push({
            lessonId,
            lessonTitle: recentActivity.title,
            elapsedSeconds,
            currentStep: recentActivity.step,
            totalSteps: recentActivity.totalSteps
          });
        }
      }
    });

    const newState: AwardState = {
      ...currentState,
      levelProgress,
      medals,
      weeklyProgress,
      recentActivities: [activity, ...currentState.recentActivities].slice(0, 10),
      totalItemsMastered: currentState.totalItemsMastered + (activity.result > 0.8 ? 1 : 0),
      elapsedTimeSeconds,
      isTimerRunning,
      activeLessonStopwatch,
      pausedLessons
    };

    this.awardStateSubject.next(newState);
  }

  getAwardState(): AwardState {
    return this.awardStateSubject.value;
  }
}
