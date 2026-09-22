import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { LucideAngularModule, Pin, Trash2 } from 'lucide-angular';
import { Note } from '../../../core/models/note.model';
import { AuthService } from '../../../core/auth/auth.service';
import { cardClassForColor } from '../../constants/note-colors';
import { stripHtml } from '../../utils/html.util';

@Component({
  selector: 'qn-note-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  templateUrl: './note-card.component.html',
})
export class NoteCardComponent {
  private readonly authService = inject(AuthService);

  readonly note = input.required<Note>();

  readonly open = output<string>();
  readonly togglePinned = output<string>();
  readonly deleteNote = output<string>();

  protected readonly cardClass = computed(() => cardClassForColor(this.note().color));
  protected readonly preview = computed(() => stripHtml(this.note().contentHtml));
  protected readonly formattedDate = computed(() =>
    new Date(this.note().createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  );
  protected readonly pinIcon = Pin;
  protected readonly pinIconClass = computed(() => (this.note().pinned ? 'h-4 w-4 fill-current' : 'h-4 w-4'));
  protected readonly trashIcon = Trash2;
  protected readonly ownerLabel = computed(() =>
    this.note().owner === this.authService.currentUser() ? 'You' : this.note().owner,
  );
}
