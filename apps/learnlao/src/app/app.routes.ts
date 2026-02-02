import { Routes } from '@angular/router';
import { MarathonViewComponent } from './marathon-view.component';
import { DiagnosticViewComponent } from './diagnostic-view.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent)
  },
  {
    path: 'topics/:id',
    loadComponent: () => import('./topics.component').then(m => m.TopicsComponent)
  },
  {
    path: 'topics',
    loadComponent: () => import('./topics.component').then(m => m.TopicsComponent)
  },
  {
    path: 'learn',
    loadComponent: () => import('./learn.component').then(m => m.LearnComponent)
  },
  {
    path: 'fsrs',
    loadComponent: () => import('./fsrs-game.component').then(m => m.FsrsGameComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress.component').then(m => m.ProgressComponent)
  },
  {
    path: 'dict',
    loadComponent: () => import('./dict.component').then(m => m.DictComponent)
  },
  {
    path: 'word/:id',
    loadComponent: () => import('./word-detail.component').then(m => m.WordDetailComponent)
  },
    // THE GAME: Real-world English-Lao-German learning
  { path: 'marathon', component: MarathonViewComponent },
  
  // THE LAB: High-speed FSRS simulation (Sandbox)
  { path: 'test-lab', component: DiagnosticViewComponent },
];
