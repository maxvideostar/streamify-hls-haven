
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamCardProps {
  id: string;
  title: string;
  streamer: string;
  thumbnail: string;
  viewers?: number;
  isLive?: boolean;
  isFeatured?: boolean;
}

const StreamCard: React.FC<StreamCardProps> = ({
  id,
  title,
  streamer,
  thumbnail,
  viewers,
  isLive = false,
  isFeatured = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/player/${id}`}
      className={cn(
        "group relative block rounded-lg overflow-hidden shadow-md transition-all duration-300 h-full bg-white dark:bg-black/40 hover:shadow-lg",
        isFeatured ? "transform-gpu" : "",
        isHovered ? "scale-[1.02]" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 shimmer" />
        )}
        
        <img
          src={thumbnail}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            !imageLoaded ? "opacity-0" : "opacity-100",
            isHovered ? "scale-105" : "scale-100"
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300",
          isHovered ? "opacity-100" : "group-hover:opacity-60"
        )} />

        {/* Play icon on hover */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}>
          <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
        </div>
        
        {/* Live badge */}
        {isLive && (
          <div className="absolute top-2 left-2 live-indicator">
            LIVE
          </div>
        )}
        
        {/* Viewer count */}
        {viewers !== undefined && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <Users size={12} />
            <span>{viewers.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col space-y-1">
        <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{streamer}</p>
      </div>
    </Link>
  );
};

export default StreamCard;
