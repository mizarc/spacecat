// src/core/types.ts

export interface UnifiedMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  channelId: string;
  platform: 'discord' | 'fluxer';
  
  /**
   * Universal method to send a reply back to the originating platform.
   */
  reply: (content: string) => Promise<void>;
}

export interface BotCommand {
  name: string;
  description: string;
  execute: (message: UnifiedMessage, args: string[]) => Promise<void>;
}