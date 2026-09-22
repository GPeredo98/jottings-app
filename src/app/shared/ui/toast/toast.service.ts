import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
}

const DISPLAY_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsState = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this.toastsState.asReadonly();

  show(message: string): void {
    const id = this.nextId++;
    this.toastsState.update((toasts) => [...toasts, { id, message }]);
    setTimeout(() => this.dismiss(id), DISPLAY_MS);
  }

  dismiss(id: number): void {
    this.toastsState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
