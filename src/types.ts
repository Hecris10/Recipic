export interface Choice {
  finish_reason: string;
  index: number;
  message: {
    content: string;
    role: string;
  };
}
