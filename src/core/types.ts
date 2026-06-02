// src/core/types.ts
import type { ChatInputCommandInteraction } from 'discord.js';

export interface ReplyEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  thumbnail?: { url: string };
  image?: { url: string };
  footer?: { text: string };
}

export interface ReplyOptions {
  content: string;
  files?: Buffer[];
  embeds?: ReplyEmbed[];
}

export interface UnifiedMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  channelId: string;
  interaction?: ChatInputCommandInteraction;
  platform: 'discord' | 'fluxer';
  
  /**
   * Universal method to send a reply back to the originating platform.
   * Accepts plain text or an object with content and optional file buffers.
   */
  reply: (response: string | ReplyOptions) => Promise<any>;

  /**
   * Universal method to edit the last sent reply.
   */
  edit: (content: string) => Promise<any>;
}

export interface BotCommand {
  name: string;
  description: string;
  category: 'automation' | 'knowledge' | 'social' | 'utility';
  execute: (message: UnifiedMessage, args: string[]) => Promise<void>;
}