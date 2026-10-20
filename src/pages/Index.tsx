import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Play } from 'lucide-react';
import StreamCard from '@/components/StreamCard';
import { Button } from '@/components/ui/button';
import { useChannels, groupChannels } from '@/lib/channels';

const Index: React.FC = () => {
  const { data: channels = [], isLoading, error } = useChannels();
  const groups = groupChannels(channels);
  const first = channels[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="relative z-10 page-container flex flex-col items-center text-center max-w-4xl space-y-6 animate-fade-in">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary border border-primary/20">
            {channels.length > 0 ? `${channels.length} canale live` : 'Live TV'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            NetStreaming Live TV
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Televiziuni românești în direct, livrate prin HLS.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            {first && (
              <Button asChild size="lg" className="gap-2 shadow-lg">
                <Link to={`/player/${first.id}`}>
                  <Play size={18} /> Pornește {first.name}
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/multi-player">
                <LayoutGrid size={18} /> Multi-view
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Channels */}
      <div className="page-container pb-16 space-y-12">
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
            <p className="font-medium">Nu am putut încărca lista de canale.</p>
            <p className="text-sm text-muted-foreground mt-1">{(error as Error).message}</p>
          </div>
        )}

        {!isLoading && !error && channels.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            Nu există canale. Adaugă-le în <code>channels.json</code>.
          </p>
        )}

        {[...groups.entries()].map(([group, list]) => (
          <section key={group}>
            <h2 className="text-2xl font-bold mb-6">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
              {list.map((c) => (
                <StreamCard key={c.id} channel={c} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="bg-secondary/80 py-8 mt-auto">
        <div className="page-container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} netstreaming.eu
        </div>
      </footer>
    </div>
  );
};

export default Index;
