import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Plus, Settings2 } from 'lucide-angular';
import { NotesFacade } from '../../application/notes.facade';
import { AuthService } from '../../core/auth/auth.service';
import { NoteCardComponent } from '../../shared/ui/note-card/note-card.component';

@Component({
  selector: 'qn-notes-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, NoteCardComponent],
  templateUrl: './notes-list.page.html',
})
export class NotesListPage {
  private readonly facade = inject(NotesFacade);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly notes = this.facade.notes;
  protected readonly currentUser = this.authService.currentUser;
  protected readonly settingsIcon = Settings2;
  protected readonly newNoteIcon = Plus;

  protected createNote(): void {
    const note = this.facade.createNote();
    if (!note) {
      return;
    }
    this.router.navigate(['/note', note.id]);
  }

  protected openNote(id: string): void {
    this.router.navigate(['/note', id]);
  }

  protected openSettings(): void {
    this.router.navigate(['/settings']);
  }

  protected togglePinned(id: string): void {
    this.facade.togglePinned(id);
  }

  protected deleteNote(id: string): void {
    this.facade.deleteNote(id);
  }
}
