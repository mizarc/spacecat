import { t } from '../../i18n.js';
import type { BotCommand } from '../../types.js';

interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const CurrencyCommand: BotCommand = {
  name: 'currency',
  description:
    'Converts an amount from one currency to another. '
    + 'Usage: !currency <amount> <from> <to>',
  category: 'knowledge',
  parameters: [
    { name: 'amount', description: 'The amount to convert', type: 'number', required: true },
    { name: 'from', description: 'The source currency code (e.g. USD)', type: 'string', required: true },
    { name: 'to', description: 'The target currency code (e.g. EUR)', type: 'string', required: true },
  ],
  async execute(message, args) {
    if (args.length < 3) {
      await message.reply(t('commands.currency.noInput'));
      return;
    }

    const amount = parseFloat(args[0]!);
    if (isNaN(amount) || amount <= 0) {
      await message.reply(t('commands.currency.invalidAmount'));
      return;
    }

    const from = args[1]!;
    const to = args.slice(2).join('');

    console.log(t('commands.currency.converting', { amount: String(amount), from, to }));

    try {
      const result = await convertCurrency(amount, from, to);
      await message.reply(
        t('commands.currency.result', {
          amount: String(result.amount),
          from: result.from,
          to: result.to,
          result: String(result.result),
          rate: String(result.rate),
        })
      );
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : '';
      await message.reply(
        msg
          ? t('commands.currency.errorDetail', { detail: msg })
          : t('commands.currency.error')
      );
    }
  },
};


export async function convertCurrency(
  amount: number,
  from: string,
  to: string,
): Promise<{ amount: number; from: string; to: string; result: number; rate: number }> {
  const base = from.toUpperCase();
  const target = to.toUpperCase();

  const res = await fetch(`https://api.frankfurter.app/latest?base=${base}`);
  if (!res.ok) {
    throw new Error(`Currency request failed: ${res.status}`);
  }

  const data: ExchangeRateResponse = await res.json();
  const rate = data.rates[target];
  if (!rate) {
    throw new Error(`Unsupported currency code: ${target}`);
  }

  return {
    amount,
    from: base,
    to: target,
    result: Math.round(amount * rate * 100) / 100,
    rate,
  };
}