import { t } from '../../i18n.js';
import type { BotCommand } from '../../types.js';

export const EchoCommand: BotCommand = {
  name: 'echo',
  description: 'Repeats the message you provide.',
  category: 'utility',
  parameters: [
    { name: 'text', description: 'The text to repeat', type: 'string', required: true },
  ],
  async execute(message, args) {
    const text = args.join(' ').trim();

    if (!text) {
      await message.reply(t('commands.echo.noInput'));
      return;
    }

    await message.reply(text);
  },
};
