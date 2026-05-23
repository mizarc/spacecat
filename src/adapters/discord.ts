import { Client, GatewayIntentBits, type Message, Events } from 'discord.js';
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

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // Map to UnifiedMessage
    const unified: UnifiedMessage = {
      id: interaction.id,
      content: interaction.commandName,
      userId: interaction.user.id,
      username: interaction.user.username,
      channelId: interaction.channelId,
      platform: 'discord',
      interaction: interaction,
      reply: async (text) => {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(text);
        } else {
          await interaction.reply(text);
        }
      }
    };

    // Send to Router
    await handleIncomingMessage(unified, true);
  });

  client.login(process.env.DISCORD_TOKEN);
}