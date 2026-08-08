import type { Metadata } from "next";
import { CreateStudio } from "@/components/create/CreateStudio";

export const metadata: Metadata = {
  title: "Create",
  description: "Upload a photo and generate your HH Goa 2026 Frame or Builder ID.",
};

export default function CreatePage() {
  return <CreateStudio />;
}
