import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header style="padding:0.5rem 1rem; background:#143f6b; color:white;">
      <h1 style="margin:0; font-size:1.25rem;">Hospital - Pacientes</h1>
    </header>
    <main style="padding:1rem;">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hospital-app');
}
