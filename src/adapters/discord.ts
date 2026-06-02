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
      avatarUrl: interaction.user.displayAvatarURL({ size: 1024 }),
      platform: 'discord',
      interaction: interaction,
      fetchUser: async (userId) => {
        try {
          const user = await interaction.client.users.fetch(userId);
          return {
            username: user.username,
            avatarUrl: user.displayAvatarURL({ size: 1024 }),
          };
        } catch {
          return null;
        }
      },
      reply: async (response) => {
        if (typeof response === 'string') {
          if (interaction.deferred || interaction.replied) {
            return await interaction.editReply(response);
          }
          return await interaction.reply(response);
        }
        const opts: Record<string, unknown> = {};
        opts.content = response.content;
        if (response.files?.length) {
          opts.files = response.files.map((f) => ({
            attachment: f,
            name: 'image.png',
          }));
        }
        if (response.embeds?.length) {
          opts.embeds = response.embeds;
        }
        if (interaction.deferred || interaction.replied) {
          return await interaction.editReply(opts);
        }
        return await interaction.reply(opts);
      },
      edit: async (text) => {
        return await interaction.editReply(text);
      }
    };

    // Send to Router
    await handleIncomingMessage(unified, true);
  });

  client.login(process.env.DISCORD_TOKEN);
}