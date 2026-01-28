import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent)
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
    path: 'dict',
    loadComponent: () => import('./dict.component').then(m => m.DictComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress.component').then(m => m.ProgressComponent)
  }
];
