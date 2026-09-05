import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArrowLeft, LucideAngularModule, Pin, Settings, Trash2 } from 'lucide-angular';
import { NotesFacade } from '../../application/notes.facade';
import { TableEditorService } from '../../application/services/table-editor.service';
import { NoteColor } from '../../core/models/note.model';
import { cardClassForColor, NOTE_COLOR_SWATCHES } from '../../shared/constants/note-colors';
import { debounce } from '../../shared/utils/debounce.util';
import { FormattingToolbarComponent } from '../../shared/ui/formatting-toolbar/formatting-toolbar.component';
import { GadgetsToolbarComponent } from '../../shared/ui/gadgets-toolbar/gadgets-toolbar.component';
import { RecentTabsComponent } from '../../shared/ui/recent-tabs/recent-tabs.component';

@Component({
  selector: 'qn-note-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule, RouterLink, FormattingToolbarComponent, GadgetsToolbarComponent, RecentTabsComponent],
  templateUrl: './note-detail.page.html'
})
export class NoteDetailPage {
  private readonly facade = inject(NotesFacade);
  private readonly router = inject(Router);
  private readonly tableEditor = inject(TableEditorService);

  readonly id = input.required<string>();

  protected readonly note = computed(() => this.facade.notes().find((n) => n.id === this.id()));
  protected readonly recentNotes = this.facade.recentNotes;
  protected readonly colorSwatches = NOTE_COLOR_SWATCHES;
  protected readonly cardClass = computed(() => cardClassForColor(this.note()?.color ?? 'default'));
  protected readonly showColorPanel = signal(false);
  protected readonly autoRenameId = signal<string | null>(null);
  protected readonly backIcon = ArrowLeft;
  protected readonly pinIcon = Pin;
  protected readonly trashIcon = Trash2;
  protected readonly settingsIcon = Settings;

  private readonly editor = viewChild<ElementRef<HTMLDivElement>>('editor');

  private readonly saveContent = debounce((id: string, html: string) => this.facade.updateContent(id, html), 300);
  private detachTableEditor: (() => void) | null = null;

  constructor() {
    // Wire up hover-to-grow table controls once the editor host exists; the
    // same DOM node is reused across note switches, so this only needs to
    // run once.
    effect(() => {
      const editorEl = this.editor();
      if (!editorEl || this.detachTableEditor) {
        return;
      }
      this.detachTableEditor = this.tableEditor.attach(editorEl.nativeElement);
    });
    inject(DestroyRef).onDestroy(() => this.detachTableEditor?.());

    // Track this note as opened (recent tabs), trigger inline rename for
    // freshly created notes, or bounce back to the list if it no longer exists.
    effect(() => {
      const id = this.id();
      untracked(() => {
        if (!this.facade.noteById(id)) {
          this.router.navigate(['/']);
          return;
        }
        this.facade.openNote(id);
        if (this.facade.newNoteId() === id) {
          this.autoRenameId.set(id);
          this.facade.clearNewNoteId();
        }
      });
    });

    // Load the note content into the editor/title fields imperatively, only
    // when switching notes, so typing never gets fought by a re-binding.
    effect(() => {
      const id = this.id();
      const editorEl = this.editor();
      if (!editorEl) {
        return;
      }
      const note = untracked(() => this.facade.noteById(id));
      editorEl.nativeElement.innerHTML = note?.contentHtml ?? '';
    });
  }

  protected onContentInput(event: Event): void {
    const editorEl = event.target as HTMLDivElement;
    const value = this.tableEditor.getPersistableHtml(editorEl);
    this.saveContent(this.id(), value);
  }

  protected selectColor(color: NoteColor): void {
    debugger
    this.facade.updateColor(this.id(), color);
  }

  protected onRenameNote(event: { id: string; title: string }): void {
    this.facade.updateTitle(event.id, event.title);
  }

  protected toggleColorPanel(): void {
    this.showColorPanel.update((value) => !value);
  }

  protected togglePinned(): void {
    this.facade.togglePinned(this.id());
  }

  protected deleteNote(): void {
    this.facade.deleteNote(this.id());
    this.router.navigate(['/']);
  }

  protected openRecentNote(id: string): void {
    debugger
    this.router.navigate(['/note', id]);
  }

  protected closeRecentTab(id: string): void {
    debugger
    const wasActiveTab = id === this.id();
    this.facade.removeFromRecent(id);
    if (wasActiveTab) {
      const next = this.recentNotes()[0];
      this.router.navigate(next ? ['/note', next.id] : ['/']);
    }
  }
}
