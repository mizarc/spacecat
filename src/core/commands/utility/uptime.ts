import type { BotCommand } from '../../types.js';

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export const UptimeCommand: BotCommand = {
  name: 'uptime',
  description: 'Shows how long the bot has been running.',
  category: 'utility',
  async execute(message) {
    const uptime = process.uptime();
    const formatted = formatUptime(uptime);
    await message.reply(`🤖 Bot has been up for **${formatted}**`);
  }
};
