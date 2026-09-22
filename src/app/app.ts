import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { ThemeService } from './core/theme/theme.service';
import { AppUpdateService } from './core/update/app-update.service';
import { ToastContainerComponent } from './shared/ui/toast/toast-container.component';

@Component({
  imports: [RouterOutlet, ToastContainerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor(
    private readonly _themeService: ThemeService,
    private readonly _authService: AuthService,
    appUpdateService: AppUpdateService,
  ) {
    appUpdateService.init();
  }
}
