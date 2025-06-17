export interface Message {
  message_id: number;
  sender: Sender;
  text: string;
}

export enum Sender {
  BOT = "bot",
  USER = "user",
}
