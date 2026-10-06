import type { CandidateComment, UserRole } from "@/data/mock";

export interface Actor {
  name: string;
  role: UserRole;
}

/**
 * Mock permission rule, kept in one place so real roles can plug in later.
 * System comments are locked; Admin edits everything; Staff only their own.
 */
export function canEdit(comment: CandidateComment, user: Actor): boolean {
  if (comment.system) return false;
  return user.role === "Admin" || comment.author === user.name;
}
