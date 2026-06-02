import type { BotCommand } from '../../types.js';

export const EchoCommand: BotCommand = {
  name: 'echo',
  description: 'Repeats the message you provide.',
  category: 'utility',
  async execute(message, args) {
    const text = args.join(' ').trim();

    if (!text) {
      await message.reply(
        '❌ Please provide something to echo.\n' +
        'Usage: `!echo Hello, world!`'
      );
      return;
    }

    await message.reply(text);
  },
};
