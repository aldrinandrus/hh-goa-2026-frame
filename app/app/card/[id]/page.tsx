import { redirect } from "next/navigation";

/** Legacy path → canonical /builder/[id] */
export default async function LegacyCardRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/builder/${id}`);
}
