import { fetchServerNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchServerNoteById(id);

  const noteTitle = note.title || "Note Details";
  const noteDescription =
    note.content?.slice(0, 160) || "Detailed note description.";
  const noteUrl = `https://08-zustand-alpha.vercel.app/notes/${id}`;
  const noteImageUrl =
    "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

  return {
    title: `${noteTitle} - NoteHub`,
    description: noteDescription,
    openGraph: {
      title: noteTitle,
      description: noteDescription,
      url: noteUrl,
      siteName: "NoteHub",
      images: [
        {
          url: noteImageUrl,
          width: 1200,
          height: 630,
          alt: "NoteHub App image",
        },
      ],
      locale: "en-US",
      type: "website",
    },
  };
}

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchServerNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
