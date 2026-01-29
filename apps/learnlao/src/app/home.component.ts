import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <div class="container">
        <header class="header">
          <h1 class="logo">LearnLao</h1>
        </header>

        <main class="main-content">
          <nav class="nav-grid">
            <a class="nav-item" routerLink="/topics">
              Topics
            </a>
            <a class="nav-item" routerLink="/learn">
              Learn
            </a>
            <a class="nav-item" routerLink="/dict">
              Dict
            </a>
            <a class="nav-item" routerLink="/progress">
              Progress
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

    .logo {
      font-size: 3rem;
      font-weight: 300;
      margin: 0;
      color: #000;
      letter-spacing: -0.5px;
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
    }
  `]
})
export class HomeComponent {}
