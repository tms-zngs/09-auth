import { Note, NoteFormValues } from "@/types/note";
import { nextServer } from "./api";
import { UserRequest } from "@/types/user";

export type User = {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  photoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CheckSessionRequest = {
  success: boolean;
};

export type FetchNotesParams = {
  page: number;
  searchQuery?: string;
  perPage?: number;
  tag?: string;
};
export interface ApiResponse {
  notes: Note[];
  totalPages: number;
}

export interface Params {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface UpdateUserRequest {
  username: string;
}

export const fetchNotes = async ({
  page = 1,
  searchQuery,
  perPage = 12,
  tag,
}: FetchNotesParams): Promise<ApiResponse> => {
  const trimmedSearch = searchQuery?.trim();
  const trimmedTag = tag?.trim();

  const params: Params = {
    page,
    perPage,
    ...(trimmedSearch && { search: trimmedSearch }),
    ...(trimmedTag && { tag: trimmedTag }),
  };

  try {
    const response = await nextServer.get<ApiResponse>(`/notes`, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const response = await nextServer.get<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch note with id ${id}:`, error);
    throw error;
  }
};

export const createNote = async (newNote: NoteFormValues): Promise<Note> => {
  try {
    const response = await nextServer.post<Note>(`/notes`, newNote);
    return response.data;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response = await nextServer.delete<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw error;
  }
};

export const register = async (data: UserRequest): Promise<User> => {
  try {
    const response = await nextServer.post<User>("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error;
  }
};

export const login = async (data: UserRequest): Promise<User> => {
  try {
    const res = await nextServer.post<User>("/auth/login", data);
    return res.data;
  } catch (error) {
    console.error("Failed to login user:", error);
    throw error;
  }
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>(`/users/me`);
  return data;
};

export const updateMe = async ({
  username,
}: UpdateUserRequest): Promise<User> => {
  try {
    const res = await nextServer.patch<User>("/users/me", { username });
    return res.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};
