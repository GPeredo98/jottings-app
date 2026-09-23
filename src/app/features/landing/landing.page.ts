import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ArrowDown,
  Check,
  Download,
  Layers,
  LogIn,
  LucideAngularModule,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Zap,
} from 'lucide-angular';
import { MAX_NOTES_PER_USER } from '../../core/models/note.defaults';

@Component({
  selector: 'qn-landing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './landing.page.html',
})
export class LandingPage {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyObserver: (() => void) | null = null;

  protected readonly loginIcon = LogIn;
  protected readonly arrowDownIcon = ArrowDown;
  protected readonly sparklesIcon = Sparkles;
  protected readonly checkIcon = Check;
  protected readonly zapIcon = Zap;
  protected readonly devicesIcon = MonitorSmartphone;
  protected readonly tabsIcon = Layers;
  protected readonly paletteIcon = Palette;
  protected readonly installIcon = Download;
  protected readonly freeLimit = MAX_NOTES_PER_USER;

  constructor() {
    afterNextRender(() => {
      const targets = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('qn-revealed');
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15 },
      );
      targets.forEach((target) => observer.observe(target));
      this.destroyObserver = () => observer.disconnect();
    });
    inject(DestroyRef).onDestroy(() => this.destroyObserver?.());
  }
}
