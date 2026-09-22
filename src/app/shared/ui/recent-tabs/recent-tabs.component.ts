import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Note } from '../../../core/models/note.model';

@Component({
  selector: 'qn-recent-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './recent-tabs.component.html',
  host: { class: 'flex min-w-0 flex-1' },
})
export class RecentTabsComponent {
  readonly notes = input.required<Note[]>();
  readonly activeId = input.required<string>();
  readonly autoRenameId = input<string | null>(null);

  readonly open = output<string>();
  readonly close = output<string>();
  readonly rename = output<{ id: string; title: string }>();

  protected readonly editingId = signal<string | null>(null);
  protected readonly closeIcon = X;

  private readonly renameInput = viewChild<ElementRef<HTMLInputElement>>('renameInput');

  constructor() {
    effect(() => {
      const id = this.autoRenameId();
      if (id) {
        this.editingId.set(id);
      }
    });

    effect(() => {
      const el = this.renameInput();
      if (el && this.editingId()) {
        el.nativeElement.focus();
        el.nativeElement.select();
      }
    });
  }

  protected onTabClick(note: Note): void {
    if (note.id !== this.activeId()) {
      this.open.emit(note.id);
      return;
    }
    if (this.editingId() !== note.id) {
      this.editingId.set(note.id);
    }
  }

  protected commitRename(id: string, event: FocusEvent): void {
    const title = (event.target as HTMLInputElement).value;
    this.editingId.set(null);
    this.rename.emit({ id, title });
  }
}
