import { useQuery } from '@tanstack/react-query';

export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  description?: string;
}

interface ChannelsConfig {
  /** Optional M3U playlist URL. If set, channels are read from it (and merged after `channels`). */
  playlist?: string;
  channels?: Partial<Channel>[];
}

/** Config file location. Override at build time with VITE_CHANNELS_URL. */
const CONFIG_URL = import.meta.env.VITE_CHANNELS_URL || '/channels.json';

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'canal';

const attr = (line: string, key: string) => {
  const m = line.match(new RegExp(`${key}="([^"]*)"`, 'i'));
  return m ? m[1].trim() : undefined;
};

/** Parse an #EXTM3U playlist (tvg-id, tvg-name, tvg-logo, group-title supported). */
export const parseM3U = (text: string): Channel[] => {
  const out: Channel[] = [];
  let pending: Partial<Channel> | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF')) {
      const comma = line.lastIndexOf(',');
      const name = (comma >= 0 ? line.slice(comma + 1) : '').trim() || attr(line, 'tvg-name') || 'Canal';
      pending = {
        id: attr(line, 'tvg-id'),
        name,
        logo: attr(line, 'tvg-logo'),
        group: attr(line, 'group-title'),
      };
    } else if (!line.startsWith('#')) {
      const p: Partial<Channel> = pending || { name: line.split('/').slice(-2, -1)[0] || 'Canal' };
      out.push({ ...p, id: p.id || slugify(p.name!), name: p.name!, url: line });
      pending = null;
    }
  }
  return out;
};

const normalize = (list: Partial<Channel>[]): Channel[] => {
  const seen = new Set<string>();
  return list
    .filter((c): c is Partial<Channel> & { url: string } => !!c?.url)
    .map((c) => {
      const name = c.name?.trim() || 'Canal';
      let id = slugify(c.id || name);
      let n = 2;
      while (seen.has(id)) id = `${slugify(c.id || name)}-${n++}`;
      seen.add(id);
      return { ...c, id, name, group: c.group?.trim() || 'Live TV' } as Channel;
    });
};

export const loadChannels = async (): Promise<Channel[]> => {
  const res = await fetch(CONFIG_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Nu pot citi ${CONFIG_URL} (HTTP ${res.status})`);
  const body = await res.text();

  // The config URL may point directly at an .m3u / .m3u8 playlist.
  if (body.trimStart().startsWith('#EXTM3U')) return normalize(parseM3U(body));

  const cfg: ChannelsConfig = JSON.parse(body);
  let list: Partial<Channel>[] = cfg.channels || [];

  if (cfg.playlist) {
    const pl = await fetch(cfg.playlist, { cache: 'no-store' });
    if (!pl.ok) throw new Error(`Nu pot citi playlist-ul (HTTP ${pl.status})`);
    list = [...list, ...parseM3U(await pl.text())];
  }
  return normalize(list);
};

export const useChannels = () =>
  useQuery({
    queryKey: ['channels'],
    queryFn: loadChannels,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
  });

export const groupChannels = (channels: Channel[]) => {
  const groups = new Map<string, Channel[]>();
  for (const c of channels) {
    const g = c.group || 'Live TV';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(c);
  }
  return groups;
};
