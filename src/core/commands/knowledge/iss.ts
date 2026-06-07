import { t } from '../../i18n.js';
import type { BotCommand } from '../../types.js';

interface IssPositionResponse {
  iss_position: {
    latitude: string;
    longitude: string;
  };
  timestamp: number;
  message: string;
}

interface AstrosResponse {
  people: Array<{ name: string; craft: string }>;
  number: number;
  message: string;
}

export interface IssData {
  lat: string;
  lon: string;
  timestamp: number;
  crewCount: number;
  crewNames: string[];
  mapsUrl: string;
}

const fetchWithTimeout = (url: string, ms = 10000) =>
  fetch(url, { signal: AbortSignal.timeout(ms) });

async function fetchCrew(): Promise<{ crewCount: number; crewNames: string[] }> {
  try {
    const res = await fetchWithTimeout(
      'http://api.open-notify.org/astros.json',
    );
    if (!res.ok) return { crewCount: 0, crewNames: [] };

    const data: AstrosResponse = await res.json();
    const issCrew = data.people.filter(p => p.craft === 'ISS');
    return {
      crewCount: issCrew.length,
      crewNames: issCrew.map(p => p.name),
    };
  } catch {
    return { crewCount: 0, crewNames: [] };
  }
}

export async function getIssData(): Promise<IssData> {
  const posRes = await fetchWithTimeout(
    'http://api.open-notify.org/iss-now.json',
  );

  if (!posRes.ok) {
    throw new Error(`ISS position request failed: ${posRes.status}`);
  }

  const posData: IssPositionResponse = await posRes.json();

  if (posData.message !== 'success') {
    throw new Error('Failed to retrieve ISS position.');
  }

  const { latitude, longitude } = posData.iss_position;
  const crew = await fetchCrew();

  return {
    lat: latitude,
    lon: longitude,
    timestamp: posData.timestamp,
    crewCount: crew.crewCount,
    crewNames: crew.crewNames,
    mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
  };
}

export const IssCommand: BotCommand = {
  name: 'iss',
  description:
    'Shows the current position of the International Space Station '
    + 'and who is on board.',
  category: 'knowledge',
  async execute(message, _args) {
    try {
      const data = await getIssData();
      const fields = [
        { name: t('commands.iss.fieldLatitude'), value: data.lat, inline: true },
        { name: t('commands.iss.fieldLongitude'), value: data.lon, inline: true },
        {
          name: t('commands.iss.fieldCrew'),
          value: data.crewCount > 0
            ? t('commands.iss.crewCount', {
              count: String(data.crewCount),
              names: data.crewNames.join(', '),
            })
            : t('commands.iss.crewUnavailable'),
          inline: false,
        },
      ];

      await message.reply({
        content: '',
        embeds: [
          {
            title: t('commands.iss.embedTitle'),
            color: 0x2b5cdb,
            description: t('commands.iss.mapsLink', { url: data.mapsUrl }),
            fields,
            footer: {
              text: t('commands.iss.footer', {
                time: new Date(data.timestamp * 1000).toUTCString(),
              }),
            },
          },
        ],
      });
    } catch (error) {
      console.error(error);
      await message.reply(t('commands.iss.error'));
    }
  },
};
