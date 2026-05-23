import { Client } from '@fluxerjs/core';
import type { UnifiedMessage } from '../core/types.js';
import { handleIncomingMessage } from '../core/router.js';
import { Events } from 'discord.js';

export function startFluxerBot() {
  const client = new Client({ intents: 0 });

  client.on(Events.MessageCreate, async (message) => {
    // 1. Ignore bot messages to prevent infinite loops
    if (message.author?.bot) return;
    console.log(`[FLUXER] Received message: ${message.content} from ${message.author?.username}`);

    // 2. Map to UnifiedMessage
    const unified: UnifiedMessage = {
      id: message.id,
      content: message.content,
      userId: message.author.id,
      username: message.author.username,
      channelId: message.channelId,
      platform: 'fluxer',
      reply: async (text) => {
        await message.reply(text);
      }
    };

    // 3. Send to Router
    await handleIncomingMessage(unified, false);
  });

  const fluxerToken = process.env.FLUXER_TOKEN;
  if (!fluxerToken) {
    console.error("FLUXER_TOKEN is not defined in .env");
    process.exit(1); // Stop the bot
  }
  client.login(fluxerToken);
}