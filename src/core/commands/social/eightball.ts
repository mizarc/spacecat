import { t } from '../../i18n.js';
import type { BotCommand } from '../../types.js';

const RESPONSES = [
  'commands.8ball.responseItIsCertain',
  'commands.8ball.responseItIsDecidedlySo',
  'commands.8ball.responseWithoutADoubt',
  'commands.8ball.responseYesDefinitely',
  'commands.8ball.responseYouMayRelyOnIt',
  'commands.8ball.responseAsISeeItYes',
  'commands.8ball.responseMostLikely',
  'commands.8ball.responseOutlookGood',
  'commands.8ball.responseYes',
  'commands.8ball.responseReplyHazy',
  'commands.8ball.responseAskAgainLater',
  'commands.8ball.responseBetterNotTell',
  'commands.8ball.responseCannotPredict',
  'commands.8ball.responseConcentrate',
  'commands.8ball.responseDontCountOnIt',
  'commands.8ball.responseMyReplyIsNo',
  'commands.8ball.responseMySourcesSayNo',
  'commands.8ball.responseOutlookNotSoGood',
  'commands.8ball.responseVeryDoubtful',
] as const;

export const EightballCommand: BotCommand = {
  name: '8ball',
  description: 'Ask the Magic 8-Ball a yes/no question.',
  category: 'social',
  async execute(message, args) {
    const question = args.join(' ');

    if (!question) {
      await message.reply(t('commands.8ball.noQuestion'));
      return;
    }

    const pick = RESPONSES[Math.floor(Math.random() * RESPONSES.length)]!;
    await message.reply(
      t('commands.8ball.result', { response: t(pick) }),
    );
  },
};
