import { BUILDER_TITLES } from "@/lib/design-tokens";

/** Pick a random HH Goa builder class title. */
export function randomBuilderTitle(): string {
  const index = Math.floor(Math.random() * BUILDER_TITLES.length);
  return BUILDER_TITLES[index]!;
}
