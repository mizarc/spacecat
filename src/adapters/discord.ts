import { Client, GatewayIntentBits, type Message } from 'discord.js';
import type { UnifiedMessage } from '../core/types.js';
import { handleIncomingMessage } from '../core/router.js';

export function startDiscordBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on('messageCreate', async (msg: Message) => {
    // Ignore bot messages to prevent infinite loops
    if (msg.author.bot) return;

    // Map to UnifiedMessage
    const unified: UnifiedMessage = {
      id: msg.id,
      content: msg.content,
      userId: msg.author.id,
      username: msg.author.username,
      channelId: msg.channelId,
      platform: 'discord',
      reply: async (text) => {
        await msg.reply(text);
      }
    };

    // Send to Router
    await handleIncomingMessage(unified, false);
  });

  client.login(process.env.DISCORD_TOKEN);
}