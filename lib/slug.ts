import { randomBytes } from "crypto";

export function generatePageSlug(): string {
  const timestamp = Date.now();
  const random = randomBytes(4).toString("hex");
  return `page-${timestamp}-${random}`;
}
