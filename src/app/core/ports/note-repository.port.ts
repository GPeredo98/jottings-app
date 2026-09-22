import { InjectionToken } from '@angular/core';
import { Note } from '../models/note.model';

export type NoteChange = Partial<Pick<Note, 'title' | 'contentHtml' | 'color' | 'pinned'>>;

export interface NoteUpdateOutcome {
  conflict: boolean;
  updatedAt?: string;
  latest?: Note;
}

export type RemoteNoteEvent = { type: 'upsert'; note: Note } | { type: 'delete'; id: string };

export interface NoteRepository {
  getAll(): Promise<Note[]>;
  create(note: Note): Promise<void>;
  update(id: string, changes: NoteChange, updatedAt: string, baseUpdatedAt: string): Promise<NoteUpdateOutcome>;
  delete(id: string): Promise<void>;
  subscribeToChanges(userId: string, onEvent: (event: RemoteNoteEvent) => void): () => void;
}

export const NOTE_REPOSITORY = new InjectionToken<NoteRepository>('NOTE_REPOSITORY');
