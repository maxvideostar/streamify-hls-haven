import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, ExternalLink } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useChannels, groupChannels } from '@/lib/channels';

const ALL = '__all__';
const COLS = [1, 2, 3, 4] as const;

const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

const MultiPlayer: React.FC = () => {
  const { data: channels = [], isLoading, error } = useChannels();
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState(ALL);
  const [cols, setCols] = useState<number>(3);

  const groups = [...groupChannels(channels).keys()];
  const q = search.trim().toLowerCase();
  const visible = channels.filter(
    (c) => (group === ALL || c.group === group) && (!q || c.name.toLowerCase().includes(q))
  );

  return (
    <div className="min-h-screen pt-16 pb-10 bg-background">
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="group -ml-3">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Multi-view</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden md:flex rounded-md border overflow-hidden">
              {COLS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCols(n)}
                  className={cn('px-3 py-2 text-sm', cols === n ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary')}
                >
                  {n}×
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input className="pl-10" placeholder="Caută canal..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {groups.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[ALL, ...groups].map((g) => (
              <Button key={g} size="sm" variant={group === g ? 'default' : 'outline'} onClick={() => setGroup(g)}>
                {g === ALL ? 'Toate' : g}
              </Button>
            ))}
          </div>
        )}

        <Separator className="mb-6" />

        {isLoading && <p className="text-center text-muted-foreground py-12">Se încarcă canalele…</p>}
        {error && <p className="text-center text-destructive py-12">{(error as Error).message}</p>}
        {!isLoading && !error && visible.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Niciun canal găsit.</p>
        )}

        <div className={cn('grid gap-6', gridCols[cols])}>
          {visible.map((c) => (
            <div key={c.id} className="flex flex-col bg-card rounded-lg overflow-hidden shadow-sm">
              <VideoPlayer src={c.url} autoPlay muted />
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.group}</p>
                </div>
                <Button asChild size="icon" variant="ghost">
                  <Link to={`/player/${c.id}`} aria-label={`Deschide ${c.name}`}>
                    <ExternalLink size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiPlayer;
