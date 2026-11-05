export interface Message {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export type ActionResult = { ok: true } | { ok: false; error: string };
