import * as React from "react";
import { SharedProjectPortal } from "@/features/projects/components/SharedProjectPortal";

export default async function SharedProjectPage({
  params,
}: {
  params: { shareToken: string };
}) {
  const resolvedParams = await params;
  return <SharedProjectPortal shareToken={resolvedParams.shareToken} />;
}
