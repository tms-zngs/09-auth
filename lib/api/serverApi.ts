import { nextServer } from "./api";
import { cookies } from "next/headers";
import { ApiResponse, FetchNotesParams, Params, User } from "./clientApi";
import { Note } from "@/types/note";

export const fetchServerNotes = async ({
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
    const cookieStore = await cookies();
    const response = await nextServer.get<ApiResponse>(`/notes`, {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error;
  }
};

export const fetchServerNoteById = async (id: string): Promise<Note> => {
  try {
    const cookieStore = await cookies();
    const response = await nextServer.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch note with id ${id}:`, error);
    throw error;
  }
};

export const getServerMe = async () => {
  console.log("getServerMe called");
  const cookieData = await cookies();
  const { data } = await nextServer<User>(`/users/me`, {
    headers: { Cookie: cookieData.toString() },
  });
  return data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};
