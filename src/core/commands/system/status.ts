import { t } from '../../i18n.js';
import type { BotCommand } from '../../types.js';

export const StatusCommand: BotCommand = {
  name: 'status',
  description: "Changes the bot's custom status (owner only).",
  category: 'system',
  async execute(message, args) {
    const ownerIds = (process.env.BOT_OPERATOR_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean);
    if (!ownerIds.includes(message.author.id)) {
      await message.reply(t('commands.status.notOwner'));
      return;
    }

    if (args.length < 1) {
      await message.reply(t('commands.status.usage'));
      return;
    }

    const text = args.join(' ');

    if (!message.setStatus) {
      await message.reply(t('commands.status.notAvailable'));
      return;
    }

    await message.setStatus(text);
    await message.reply(t('commands.status.success', { text }));
  },
};
