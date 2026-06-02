import QRCode from 'qrcode';
import type { BotCommand } from '../../types.js';

const MAX_DATA_LENGTH = 2000;

export const QrcodeCommand: BotCommand = {
  name: 'qrcode',
  description: 'Generates a QR code from text or a URL.',
  category: 'utility',
  async execute(message, args) {
    const data = args.join(' ').trim();

    if (!data) {
      await message.reply(
        '❌ Please provide text or a URL to encode.\n' +
        'Usage: `!qrcode https://example.com`'
      );
      return;
    }

    if (data.length > MAX_DATA_LENGTH) {
      await message.reply(
        `❌ Input too long (${data.length} chars). ` +
        `Maximum is ${MAX_DATA_LENGTH} characters.`
      );
      return;
    }

    let imageBuffer: Buffer;
    try {
      imageBuffer = await generateQrCode(data);
    } catch {
      await message.reply('❌ Failed to generate QR code.');
      return;
    }

    await message.reply({
      content: '',
      files: [imageBuffer],
      embeds: [
        {
          title: '📱 QR Code',
          color: 0x000000,
          image: { url: 'attachment://image.png' },
          footer: { text: `Data: ${data.length} chars` },
        },
      ],
    });
  },
};

/**
 * Generates a QR code PNG buffer from the given data string.
 */
export async function generateQrCode(
  data: string,
): Promise<Buffer> {
  return QRCode.toBuffer(data, {
    type: 'png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}