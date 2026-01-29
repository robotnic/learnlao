import { Routes } from '@angular/router';

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
    path: 'progress',
    loadComponent: () => import('./learn-fsrs/components/progress.component').then(m => m.ProgressComponent)
  },
  {
    path: 'dict',
    loadComponent: () => import('./dict.component').then(m => m.DictComponent)
  },
  {
    path: 'word/:id',
    loadComponent: () => import('./word-detail.component').then(m => m.WordDetailComponent)
  }
];
