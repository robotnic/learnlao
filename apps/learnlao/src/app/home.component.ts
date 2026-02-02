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
          <div class="header-top">
            <h1 class="logo">LearnLao</h1>
          </div>
          <div class="subtitle">
            <div>ຮຽນພາສາລາວ</div>
            <div class="subtitle-eng">Learn Lao Language</div>
          </div>
        </header>

        <main class="main-content">
          <nav class="nav-grid">
            <a class="nav-item" routerLink="/topics">
              <div class="text-bilingual">
                <div class="text-lao">ຫົວຂໍ້</div>
                <div class="text-eng">Topics</div>
              </div>
            </a>
            <a class="nav-item" routerLink="/learn">
              <div class="text-bilingual">
                <div class="text-lao">ຮຽນ</div>
                <div class="text-eng">Learn</div>
              </div>
            </a>
            <a class="nav-item" routerLink="/dict">
              <div class="text-bilingual">
                <div class="text-lao">ວັດຈະນານຸກຣົມ</div>
                <div class="text-eng">Dict</div>
              </div>
            </a>
            <a class="nav-item" routerLink="/progress">
              <div class="text-bilingual">
                <div class="text-lao">ກ້າວຫນ້າ</div>
                <div class="text-eng">Progress</div>
              </div>
            </a>
                        <a class="nav-item" routerLink="/marathon">
              <div class="text-bilingual">
                <div class="text-lao">ຮຽນ2</div>
                <div class="text-eng">Learn hard</div>
              </div>
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

    .subtitle {
      margin-top: 1rem;
      font-size: 1rem;
      color: #666;
      font-weight: 300;
      text-align: center;
    }

    .subtitle div {
      line-height: 1.4;
    }

    .subtitle-eng {
      color: #999;
      font-size: 0.95rem;
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
      padding: 2rem 1.5rem;
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

    .text-bilingual {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      align-items: center;
    }

    .text-lao {
      font-size: 1.25rem;
      font-weight: 400;
    }

    .text-eng {
      font-size: 1.25rem;
      font-weight: 300;
      color: #666;
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
export class HomeComponent {
}
