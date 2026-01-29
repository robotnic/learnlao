import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
            <canvas #qrcanvas></canvas>
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

    canvas {
      max-width: 150px;
      height: auto;
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
export class HomeComponent implements AfterViewInit {
  @ViewChild('qrcanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.generateQRCode();
  }

  private generateQRCode(): void {
    const url = 'https://robotnic.github.io/learnlao/';
    const canvas = this.qrCanvas.nativeElement;

    // Simple QR code generation using a third-party service embedded as data
    // Using the API endpoint approach with canvas
    const encodedUrl = encodeURIComponent(url);
    const qrSize = 150;

    // Create a simple implementation using canvas
    // For a production app, consider using qrcode.js library
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = qrSize;
    canvas.height = qrSize;

    // Use a simple QR code library approach via image
    const img = new Image();
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodedUrl}`;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
    };
  }
}
