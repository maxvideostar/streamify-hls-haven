import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import StreamCard from '@/components/StreamCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useChannels } from '@/lib/channels';

const Player: React.FC = () => {
  const { streamId } = useParams();
  const { data: channels = [], isLoading, error } = useChannels();
  const channel = channels.find((c) => c.id === streamId) || (!streamId ? channels[0] : undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [streamId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="min-h-screen pt-32 page-container text-center space-y-4">
        <h1 className="text-2xl font-bold">Canal inexistent</h1>
        <p className="text-muted-foreground">
          {error ? (error as Error).message : `Nu există niciun canal cu id-ul „${streamId}”.`}
        </p>
        <Button asChild>
          <Link to="/">Înapoi la canale</Link>
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success('Link copiat!'))
      .catch(() => toast.error('Nu am putut copia linkul'));
  };

  const others = channels.filter((c) => c.id !== channel.id);

  return (
    <div className="min-h-screen pt-16 pb-10">
      <div className="page-container">
        <div className="mb-4">
          <Button variant="ghost" asChild className="group -ml-3">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Toate canalele
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <VideoPlayer key={channel.id} src={channel.url} title={channel.name} autoPlay />

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{channel.name}</h1>
                  <div className="live-indicator">LIVE</div>
                </div>
                <Button variant="outline" size="icon" onClick={handleShare} className="h-10 w-10 rounded-full shrink-0">
                  <Share2 size={18} />
                </Button>
              </div>
              <p className="text-muted-foreground">{channel.group}</p>
              {channel.description && (
                <>
                  <Separator />
                  <p className="text-muted-foreground">{channel.description}</p>
                </>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <h3 className="text-xl font-medium">Alte canale</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 animate-slide-up">
              {others.map((c) => (
                <StreamCard key={c.id} channel={c} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Player;
