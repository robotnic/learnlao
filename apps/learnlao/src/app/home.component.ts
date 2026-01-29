import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="home">
      <div class="container">
        <header class="header">
          <div class="header-top">
            <h1 class="logo">LearnLao</h1>
            <button class="lang-toggle" (click)="toggleLanguage()">
              {{ isEnglish ? 'ລາວ' : 'EN' }}
            </button>
          </div>
          <p class="subtitle" [ngSwitch]="isEnglish">
            <span *ngSwitchCase="true">Learn Lao Language</span>
            <span *ngSwitchDefault>ຮຽນພາສາລາວ</span>
          </p>
        </header>

        <main class="main-content">
          <nav class="nav-grid">
            <a class="nav-item" routerLink="/topics">
              <span [ngSwitch]="isEnglish">
                <span *ngSwitchCase="true">Topics</span>
                <span *ngSwitchDefault>ຫົວຂໍ້</span>
              </span>
            </a>
            <a class="nav-item" routerLink="/learn">
              <span [ngSwitch]="isEnglish">
                <span *ngSwitchCase="true">Learn</span>
                <span *ngSwitchDefault>ຮຽນ</span>
              </span>
            </a>
            <a class="nav-item" routerLink="/dict">
              <span [ngSwitch]="isEnglish">
                <span *ngSwitchCase="true">Dict</span>
                <span *ngSwitchDefault>ວັດຈະນານຸກຣົມ</span>
              </span>
            </a>
            <a class="nav-item" routerLink="/progress">
              <span [ngSwitch]="isEnglish">
                <span *ngSwitchCase="true">Progress</span>
                <span *ngSwitchDefault>ກ້າວຫນ້າ</span>
              </span>
            </a>
          </nav>

          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://robotnic.github.io/learnlao/" alt="QR Code" class="qr-code">
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
      background: #ffffff;
      color: #333;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      max-width: 600px;
      padding: 2rem;
      width: 100%;
    }

    .header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .header-top {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo {
      font-size: 3rem;
      font-weight: 300;
      margin: 0;
      color: #000;
      letter-spacing: -0.5px;
    }

    .lang-toggle {
      position: absolute;
      right: 0;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      border: 1px solid #e5e5e5;
      background: #fff;
      color: #000;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 4px;
      font-weight: 500;
    }

    .lang-toggle:hover {
      border-color: #000;
      background: #fafafa;
    }

    .subtitle {
      margin-top: 0.5rem;
      font-size: 1rem;
      color: #666;
      font-weight: 300;
      letter-spacing: 0.3px;
    }

    .main-content {
      text-align: center;
    }

    .nav-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      max-width: 400px;
      margin: 0 auto;
    }

    .nav-item {
      padding: 3rem 2rem;
      font-size: 1.25rem;
      font-weight: 300;
      border: 1px solid #e5e5e5;
      background: #fff;
      color: #000;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }

    .nav-item:hover {
      border-color: #000;
      background: #fafafa;
    }

    .qr-section {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e5e5;
      display: flex;
      justify-content: center;
    }

    .qr-code {
      max-width: 150px;
      height: auto;
      border: 1px solid #e5e5e5;
      padding: 0.5rem;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .nav-grid {
        grid-template-columns: 1fr;
        max-width: 300px;
      }

      .nav-item {
        padding: 2rem;
      }

      .qr-section {
        margin-top: 2rem;
        padding-top: 1.5rem;
      }

      .lang-toggle {
        position: static;
        margin-top: 1rem;
      }
    }
  `]
})
export class HomeComponent {
  isEnglish = true;

  toggleLanguage(): void {
    this.isEnglish = !this.isEnglish;
  }
}
