// src/core/commands/ping.ts
import type { BotCommand } from '../types.js';

export const PingCommand: BotCommand = {
  name: 'ping',
  description: 'Checks the bot connectivity. Responds with pong.',
  async execute(message) {
    await message.reply('Pong!');
  }
};