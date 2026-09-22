import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'qn-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
