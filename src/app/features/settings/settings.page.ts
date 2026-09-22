import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogOut, LucideAngularModule, MoonStar, SunMedium } from 'lucide-angular';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { version } from '../../../../package.json';

@Component({
  selector: 'qn-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './settings.page.html',
})
export class SettingsPage {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  protected readonly currentTheme = this.themeService.currentTheme;
  protected readonly currentUser = this.authService.currentUser;
  protected readonly appVersion = version;
  protected readonly themeLabel = computed(() =>
    this.currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
  );
  protected readonly darkIcon = MoonStar;
  protected readonly lightIcon = SunMedium;
  protected readonly logoutIcon = LogOut;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
