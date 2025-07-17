"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../loading";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return <> {loading ? <Loader /> : children}</>;
}
