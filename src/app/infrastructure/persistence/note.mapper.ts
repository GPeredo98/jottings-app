import { Note, NoteColor } from '../../core/models/note.model';

export interface NoteRow {
  id: string;
  user_id: string;
  title: string;
  content_html: string;
  color: NoteColor;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export function mapRowToNote(row: NoteRow, ownerEmail: string): Note {
  return {
    id: row.id,
    title: row.title,
    contentHtml: row.content_html,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    owner: ownerEmail,
    color: row.color,
    pinned: row.pinned,
  };
}

export function mapNoteToRow(note: Note, userId: string): NoteRow {
  return {
    id: note.id,
    user_id: userId,
    title: note.title,
    content_html: note.contentHtml,
    color: note.color,
    pinned: note.pinned,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}

export function mapChangesToRow(
  changes: Partial<Pick<Note, 'title' | 'contentHtml' | 'color' | 'pinned'>>,
): Partial<Pick<NoteRow, 'title' | 'content_html' | 'color' | 'pinned'>> {
  const row: Partial<Pick<NoteRow, 'title' | 'content_html' | 'color' | 'pinned'>> = {};
  if (changes.title !== undefined) {
    row.title = changes.title;
  }
  if (changes.contentHtml !== undefined) {
    row.content_html = changes.contentHtml;
  }
  if (changes.color !== undefined) {
    row.color = changes.color;
  }
  if (changes.pinned !== undefined) {
    row.pinned = changes.pinned;
  }
  return row;
}
