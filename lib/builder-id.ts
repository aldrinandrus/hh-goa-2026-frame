/**
 * Unique Builder ID format: HHG26-348219
 */
export function generateBuilderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `HHG26-${n}`;
}

export function isValidBuilderId(id: string): boolean {
  return /^HHG26-\d{6}$/.test(id);
}
