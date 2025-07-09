"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import css from "./NoteDetails.module.css";

const NoteDetailsClient = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.editBtn}>Edit note</button>
        </div>
        <p className={css.content}>{note.content}</p>
        {note.tag && <p className={css.tag}>Tag: {note.tag}</p>}
        {note.createdAt && (
          <p className={css.date}>
            Created date: {new Date(note.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default NoteDetailsClient;
