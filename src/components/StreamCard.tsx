import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Channel } from '@/lib/channels';

interface StreamCardProps {
  channel: Channel;
  active?: boolean;
}

const StreamCard: React.FC<StreamCardProps> = ({ channel, active = false }) => {
  const [logoOk, setLogoOk] = useState(!!channel.logo);

  return (
    <Link
      to={`/player/${channel.id}`}
      className={cn(
        'group relative block rounded-lg overflow-hidden shadow-md transition-all duration-300 h-full bg-card hover:shadow-lg hover:scale-[1.02]',
        active && 'ring-2 ring-primary'
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/30 via-secondary to-background flex items-center justify-center">
        {logoOk ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="max-w-[60%] max-h-[60%] object-contain transition-transform duration-500 group-hover:scale-105"
            onError={() => setLogoOk(false)}
            loading="lazy"
          />
        ) : (
          <span className="text-3xl font-bold tracking-tight text-foreground/80">{channel.name}</span>
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
        </div>

        <div className="absolute top-2 left-2 live-indicator">LIVE</div>
      </div>

      <div className="p-3 flex flex-col space-y-1">
        <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {channel.name}
        </h3>
        <p className="text-sm text-muted-foreground">{channel.group}</p>
      </div>
    </Link>
  );
};

export default StreamCard;
