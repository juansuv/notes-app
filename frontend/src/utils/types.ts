export interface NoteInterface {
    title: string;
    content: string;
    shared_with: string[];
    tags: string[];
    color: string;
    id: number;
    created_at: string;
    updated_at: string;
    version: number;
    last_edited_by: number;
    owner_id: number;
  }

export interface NotesState {
  loading: boolean;
  notes: NoteInterface[];
  error: string | null;
  conflict: { serverVersion: NoteInterface; clientVersion: NoteInterface } | null; // Almacena las versiones en conflicto
}


  