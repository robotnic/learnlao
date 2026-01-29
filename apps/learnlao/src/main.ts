import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { KnowledgeBaseService } from '../../../libs/shared/services/knowledge-base.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (kbService: KnowledgeBaseService) => () => kbService.loadKnowledgeBase(),
      deps: [KnowledgeBaseService],
      multi: true
    }
  ]
}).catch((err) => console.error(err));
