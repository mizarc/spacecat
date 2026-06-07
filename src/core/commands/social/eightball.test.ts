import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EightballCommand } from './eightball.js';

describe('EightballCommand', () => {
  let mockMessage: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMessage = {
      reply: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('should ask for a question when none is provided', async () => {
    await EightballCommand.execute(mockMessage, []);

    expect(mockMessage.reply).toHaveBeenCalledOnce();
    const reply = mockMessage.reply.mock.calls[0][0] as string;
    expect(reply).toContain('🎱');
  });

  it('should reply with a formatted result when a question is given', async () => {
    await EightballCommand.execute(mockMessage, ['Will', 'I', 'win?']);

    expect(mockMessage.reply).toHaveBeenCalledOnce();
    const reply = mockMessage.reply.mock.calls[0][0] as string;
    expect(reply).toContain('🎱');
  });

  it('should return one of the valid 8ball responses', async () => {
    const validResponses = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook is good.',
      'Yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
    ];

    await EightballCommand.execute(mockMessage, ['Test?']);

    const reply = mockMessage.reply.mock.calls[0][0] as string;
    const match = validResponses.some(r => reply.includes(r));
    expect(match).toBe(true);
  });

  it('should produce varied responses across multiple calls', async () => {
    const responses = new Set<string>();

    for (let i = 0; i < 20; i++) {
      const localMessage: any = { reply: vi.fn().mockResolvedValue(undefined) };
      await EightballCommand.execute(localMessage, ['Question?']);
      const reply = localMessage.reply.mock.calls[0][0] as string;
      responses.add(reply);
    }

    // With 19 possible responses, 20 calls should produce at least
    // 2 different answers (virtually guaranteed)
    expect(responses.size).toBeGreaterThanOrEqual(2);
  });
});
