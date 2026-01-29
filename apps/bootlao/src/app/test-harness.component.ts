import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AwardService } from '../../../../libs/shared/services/award.service';
import { LearningActivity } from '../../../../libs/shared/types/learning.types';
import { ScoreboardComponent } from '../../../../libs/shared/components/scoreboard/scoreboard.component';

@Component({
  selector: 'app-test-harness',
  standalone: true,
  imports: [CommonModule, FormsModule, ScoreboardComponent],
  templateUrl: './test-harness.component.html',
  styleUrls: ['./test-harness.component.css']
})
export class TestHarnessComponent implements OnInit, OnDestroy {
  speedMultiplier = 1;
  progressStep = 50; // 1-100 for which step in progression
  isAutoSimulating = false;
  simulationInterval: number | null = null;
  timeAdvanceInterval: number | null = null;
  isTimeAdvancing = false;
  private currentActivityIndex = 0;
  private currentAppIndex = 0;
  private activitiesWithCurrentApp = 0; // Track how many activities done with current app
  private activitiesInCurrentSession = 0; // Track activities in current practice session
  private maxActivitiesPerSession = 0; // Random number of activities per session
  private currentLessonStep = 0; // Track current step within a lesson (0 to totalSteps)
  private currentLessonTotalSteps = 0; // Total steps for current lesson
  currentLevel = 1; // Track current level, advances when activity completes
  currentPath = 'path-1'; // Track current path
  consoleLog: string[] = [];
  lastActivityJSON: string = '{ "status": "ready" }';
  
  // Simulated learning timeline - starts Jan 1, 2025
  simulatedDate = new Date(2025, 0, 1); // January 1, 2025 - public for template access
  private simulationDayIncrement = 0; // How many days to advance per activity
  private lastTimestamp = 0; // Track last timestamp to ensure uniqueness

  activities = [
    { appId: 'drill-sergeant', title: 'Drill Sergeant', activities: 9 },
    { appId: 'tone-trainer', title: 'Tone Trainer', activities: 6 },
    { appId: 'flashcard-sprint', title: 'Flashcard Sprint', activities: 15 },
    { appId: 'listen-drag', title: 'Listen & Drag', activities: 8 },
    { appId: 'fill-blank', title: 'Fill in Blank', activities: 12 }
  ];

  // Lesson mapping for each path and level
  lessonMap: Record<string, Record<number, { id: string, title: string }>> = {
    'path-1': {
      1: { id: '1-1-1', title: 'Greetings & Politeness' },
      2: { id: '1-1-2', title: 'Numbers 1-10' },
      3: { id: '1-1-3', title: 'Survival Phrases' },
      4: { id: '1-2-1', title: 'Family Members' },
      5: { id: '1-2-2', title: 'Common Objects' },
      6: { id: '1-2-3', title: 'Simple Requests' }
    },
    'path-2': {
      7: { id: '2-1-1', title: 'Introduction to Lao Script' },
      8: { id: '2-1-2', title: 'Consonants Part 1' },
      9: { id: '2-1-3', title: 'Vowels Part 1' },
      10: { id: '2-2-1', title: 'Simple Syllables' }
    }
  };

  // Store total steps for each lesson (set once per lesson)
  private lessonTotalSteps: Record<string, number> = {};

  constructor(private awardService: AwardService) {}

  ngOnInit(): void {}

  getTotalStepsForLesson(lessonId: string): number {
    if (!this.lessonTotalSteps[lessonId]) {
      // Generate random total steps between 5-15 and store it
      this.lessonTotalSteps[lessonId] = 5 + Math.floor(Math.random() * 11);
    }
    return this.lessonTotalSteps[lessonId];
  }

  getAvailableLessons(): { id: string, title: string, level: number }[] {
    // Get lessons for current path
    const pathLessons = this.lessonMap[this.currentPath] || {};
    return Object.entries(pathLessons).map(([level, lesson]) => ({
      ...lesson,
      level: parseInt(level)
    }));
  }

  sendLessonActivity(lesson: { id: string, title: string, level: number }, step: number): void {
    // Pick a random activity type
    const activity = this.activities[Math.floor(Math.random() * this.activities.length)];
    
    // Get consistent totalSteps for this lesson
    const totalSteps = this.getTotalStepsForLesson(lesson.id);
    
    // Temporarily set current level to lesson's level
    const previousLevel = this.currentLevel;
    this.currentLevel = lesson.level;
    
    // Send the activity
    this.sendActivity(activity.appId, activity.title, step, totalSteps);
    
    // Restore previous level (unless activity completed and advanced it)
    if (step !== totalSteps) {
      this.currentLevel = previousLevel;
    }
  }

  setSimulatedDay(day: number): void {
    // Manual day advance for testing
    this.simulatedDate.setDate(this.simulatedDate.getDate() + day);
  }

  startTimeAdvance(): void {
    if (this.isTimeAdvancing) {
      this.stopTimeAdvance();
      return;
    }

    this.isTimeAdvancing = true;
    // Update UI every 1 second to show changing day
    this.timeAdvanceInterval = window.setInterval(() => {
      this.simulatedDate.setDate(this.simulatedDate.getDate() + 1);
      console.log(`⏰ Simulated date: ${this.simulatedDate.toLocaleDateString()}`);
    }, 1000);
  }

  stopTimeAdvance(): void {
    if (this.timeAdvanceInterval !== null) {
      clearInterval(this.timeAdvanceInterval);
      this.timeAdvanceInterval = null;
    }
    this.isTimeAdvancing = false;
  }

  sendActivity(appId: string, appTitle: string, stepNumber: number, totalSteps: number): void {
    // Use simulated date for all activities
    let timestamp = Math.floor(new Date(this.simulatedDate).getTime() / 1000);
    
    // Ensure timestamp is unique - if same as last, increment by 1 second
    if (timestamp <= this.lastTimestamp) {
      timestamp = this.lastTimestamp + 1;
    }
    this.lastTimestamp = timestamp;
    
    // Get lesson info for current path and level
    const lessonInfo = this.lessonMap[this.currentPath]?.[this.currentLevel] || 
                      { id: 'unknown', title: 'Unknown Lesson' };
    
    // Get consistent totalSteps for this lesson
    const lessonTotalSteps = this.getTotalStepsForLesson(lessonInfo.id);
    
    const activity: LearningActivity = {
      appId,
      title: lessonInfo.title,
      lessonId: lessonInfo.id,
      step: stepNumber,
      totalSteps: lessonTotalSteps,
      path: this.currentPath,
      level: this.currentLevel,
      result: Math.random() > 0.2 ? 1 : 0, // 80% success rate (below 80% is failed)
      timestamp: timestamp
    };

    // Log to console
    const resultIcon = activity.result === 1 ? '✓' : '✗';
    const dateTime = new Date(timestamp * 1000).toISOString();
    const logEntry = `[${dateTime}] ${activity.title} L${activity.level} ${stepNumber}/${totalSteps} ${resultIcon}`;
    this.consoleLog = [logEntry, ...this.consoleLog].slice(0, 5); // Keep last 5 entries

    // Store JSON for hacker tool display
    this.lastActivityJSON = JSON.stringify(activity, null, 2);

    this.awardService.receiveActivity(activity);
    
    // Check if activity is complete and advance level
    if (stepNumber === lessonTotalSteps) {
      this.currentLevel++;
      // Wrap around after level 10 (10 levels total in curriculum)
      if (this.currentLevel > 10) {
        this.currentLevel = 1;
        // Advance to next path
        const pathNum = parseInt(this.currentPath.split('-')[1]);
        const nextPathNum = (pathNum % 5) + 1; // Cycle through paths 1-5
        this.currentPath = `path-${nextPathNum}`;
      }
      console.log(`✨ Level complete! Advanced to ${this.currentPath} Level ${this.currentLevel}`);
    }
    
    // Advance simulated date by increment (for auto-simulation)
    if (this.isAutoSimulating) {
      this.activitiesInCurrentSession++;
      
      if (this.activitiesInCurrentSession >= this.maxActivitiesPerSession) {
        // End of session - take a break (4-48 hours)
        const hoursBreak = 4 + Math.floor(Math.random() * 45);
        this.simulatedDate.setHours(this.simulatedDate.getHours() + hoursBreak);
        this.activitiesInCurrentSession = 0;
        // Set new random session length (10-25 activities)
        this.maxActivitiesPerSession = 10 + Math.floor(Math.random() * 16);
        console.log(`📴 Session break: ${hoursBreak} hours. Next session: ${this.maxActivitiesPerSession} activities`);
      } else {
        // During session - advance by 1-3 minutes between activities
        const minutesAdvance = 1 + Math.floor(Math.random() * 3);
        this.simulatedDate.setMinutes(this.simulatedDate.getMinutes() + minutesAdvance);
      }
    }
  }

  startAutoSimulation(): void {
    if (this.isAutoSimulating) {
      this.stopAutoSimulation();
      return;
    }

    this.isAutoSimulating = true;
    this.currentActivityIndex = 0;
    this.currentAppIndex = 0;
    this.activitiesWithCurrentApp = 0;
    this.activitiesInCurrentSession = 0;
    this.maxActivitiesPerSession = 10 + Math.floor(Math.random() * 16); // Random 10-25 activities per session
    this.lastTimestamp = 0; // Reset timestamp tracking
    this.currentLessonStep = 0;
    this.currentLessonTotalSteps = 0;
    
    // Reset simulated date to start of year
    this.simulatedDate = new Date(2025, 0, 1);
    
    // Reset level and path progression
    this.currentLevel = 1;
    this.currentPath = 'path-1';
    
    // Calculate day increment: vary between 5-9 days to spread across different days of week
    // This creates a realistic pattern where student doesn't always practice on the same day
    this.simulationDayIncrement = 0; // Will be set per activity
    
    const interval = 500;

    this.simulationInterval = window.setInterval(() => {
      // Switch apps occasionally (after 8-15 activities with current app)
      const switchThreshold = 8 + Math.floor(Math.random() * 8); // Random 8-15
      if (this.activitiesWithCurrentApp >= switchThreshold) {
        this.currentAppIndex = (this.currentAppIndex + 1) % this.activities.length;
        this.activitiesWithCurrentApp = 0;
      }
      
      const app = this.activities[this.currentAppIndex];
      this.activitiesWithCurrentApp++;
      
      // Get lesson info for current path and level
      const lessonInfo = this.lessonMap[this.currentPath]?.[this.currentLevel] || 
                        { id: 'unknown', title: 'Unknown Lesson' };
      const totalSteps = this.getTotalStepsForLesson(lessonInfo.id);
      
      // Check if we need to start a new lesson
      if (this.currentLessonStep > this.currentLessonTotalSteps || this.currentLessonTotalSteps === 0) {
        // Start new lesson at step 0
        this.currentLessonStep = 0;
        this.currentLessonTotalSteps = totalSteps;
      }
      
      // Randomly abandon lessons sometimes (20% chance when at 50%+ progress)
      if (this.currentLessonStep > this.currentLessonTotalSteps / 2 && 
          this.currentLessonStep < this.currentLessonTotalSteps && 
          Math.random() < 0.2) {
        console.log(`🔄 Simulating lesson pause/switch at step ${this.currentLessonStep}/${this.currentLessonTotalSteps}`);
        // Advance level so we don't get stuck on the same lesson
        this.currentLevel++;
        if (this.currentLevel > 10) {
          this.currentLevel = 1;
          const pathNum = parseInt(this.currentPath.split('-')[1]);
          const nextPathNum = (pathNum % 5) + 1;
          this.currentPath = `path-${nextPathNum}`;
        }
        // Start a new lesson instead of continuing
        this.currentLessonStep = this.currentLessonTotalSteps + 1;
        return; // Skip this iteration
      }
      
      // Only send if we haven't exceeded the total steps
      if (this.currentLessonStep <= this.currentLessonTotalSteps) {
        // Send activity with current step
        this.sendActivity(app.appId, app.title, this.currentLessonStep, totalSteps);
        
        // Increment step for next iteration
        this.currentLessonStep++;
      }
    }, interval);
  }

  stopAutoSimulation(): void {
    if (this.simulationInterval !== null) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isAutoSimulating = false;
  }

  rapidFireTest(): void {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const app = this.activities[i % this.activities.length];
        // Use slider progress step, totalSteps will be determined by lesson
        this.sendActivity(app.appId, app.title, this.progressStep, 0);
      }, i * 100);
    }
  }

  updateSpeedMultiplier(value: number): void {
    this.speedMultiplier = value;
    if (this.isAutoSimulating) {
      this.stopAutoSimulation();
      this.startAutoSimulation();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSimulation();
  }
}
