import type { BotCommand } from '../../types.js';

export const WheelspinCommand: BotCommand = {
  name: 'wheelspin',
  description: 'Spins a wheel to randomly pick an option.',
  category: 'social',
  async execute(message, args) {
    if (args.length < 2) {
      await message.reply(
        '❌ Please provide at least two options.\n' +
        'Usage: `!wheelspin pizza sushi tacos`'
      );
      return;
    }

    const options = args;
    const numOptions = options.length;
    const steps = 12;
    const winnerIndex = Math.floor(Math.random() * numOptions);

    let lastIdx = -1;

    for (let i = 0; i < steps; i++) {
      let currentIdx: number;

      if (i === steps - 1) {
        currentIdx = winnerIndex;
      } else {
        const possible: number[] = [];
        for (let idx = 0; idx < numOptions; idx++) {
          if (idx !== lastIdx) {
            possible.push(idx);
          }
        }
        currentIdx =
          possible[Math.floor(Math.random() * possible.length)]!;
      }

      lastIdx = currentIdx;

      const content =
        `## 🎡 Spinning the wheel!\n${buildDisplay(options, currentIdx)}`;

      if (i === 0) {
        await message.reply(content);
      } else {
        const waitMs = Math.round((0.1 + (i / steps) ** 2) * 1000);
        await delay(waitMs);

        if (i === steps - 1) {
          await message.edit(
            content.replace('⬅', '⬅ **WINNER**'),
          );
        } else {
          await message.edit(content);
        }
      }
    }
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildDisplay(options: string[], currentIdx: number): string {
  return options
    .map((opt, idx) => `${idx + 1}. ${opt}   ${idx === currentIdx ? '⬅' : ''}`)
    .join('\n');
}