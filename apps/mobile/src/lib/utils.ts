export function cn(...inputs: any[]): string {
  return inputs
    .flat(Infinity)
    .filter((item) => typeof item === "string" && item.trim() !== "")
    .join(" ");
}
