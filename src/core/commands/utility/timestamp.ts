import { casual } from 'chrono-node';
import type { BotCommand } from '../../types.js';

/**
 * Timestamp format labels and their style suffixes.
 */
const FORMATS: { name: string; style: string }[] = [
  { name: 'Short Time', style: 't' },
  { name: 'Long Time', style: 'T' },
  { name: 'Short Date', style: 'd' },
  { name: 'Long Date', style: 'D' },
  { name: 'Short Date/Time', style: 'f' },
  { name: 'Long Date/Time', style: 'F' },
  { name: 'Relative Time', style: 'R' },
];

export const TimestampCommand: BotCommand = {
  name: 'timestamp',
  description: 'Converts a date/time string into timestamp formats.',
  category: 'utility',
  async execute(message, args) {
    const time = args.join(' ').trim();

    if (!time) {
      await message.reply(
        '❌ Please provide a date or time.\n' +
        'Usage: `!timestamp tomorrow at 3pm`'
      );
      return;
    }

    const result = timestamp(time);
    await message.reply(result);
  },
};

/**
 * Parses a natural-language date/time string and returns a formatted
 * string with all timestamp representations.
 */
export function timestamp(time: string): string {
  const parsed = casual.parseDate(time);

  if (!parsed) {
    return '❌ Sorry, I couldn\'t understand that time format.';
  }

  const unixTime = Math.floor(parsed.getTime() / 1000);

  return FORMATS.map(({ name, style }) => {
    const code = `<t:${unixTime}:${style}>`;
    return `**${name}:** \`${code}\` -> ${code}`;
  }).join('\n');
}