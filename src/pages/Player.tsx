
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MessageSquare, Calendar, Clock, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import VideoPlayer from '@/components/VideoPlayer';
import StreamCard from '@/components/StreamCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data for streams
const STREAMS = {
  featured: {
    id: 'featured',
    title: 'Live Product Launch Event',
    streamer: 'Tech Innovations',
    description: 'Join us for the exclusive unveiling of our newest product line. Our CEO will walk through all the features and innovations that make this release special.',
    thumbnail: 'https://images.unsplash.com/photo-1603969072881-b0fc7f3d6d7a?q=80&w=2070&auto=format&fit=crop',
    viewers: 24687,
    isLive: true,
    startTime: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  stream1: {
    id: 'stream1',
    title: 'Morning Tech Talk',
    streamer: 'Developer Daily',
    description: 'Daily discussion of the latest technology trends, programming tips, and developer news. Interactive Q&A with our host throughout the stream.',
    thumbnail: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=2080&auto=format&fit=crop',
    viewers: 1243,
    isLive: true,
    startTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  stream2: {
    id: 'stream2',
    title: 'Design Workshop Live',
    streamer: 'Creative Studios',
    description: 'Learn advanced design techniques from industry professionals. This workshop covers UI/UX principles, design systems, and creative processes.',
    thumbnail: 'https://images.unsplash.com/photo-1581092335878-2d9268b5bada?q=80&w=2070&auto=format&fit=crop',
    viewers: 856,
    isLive: true,
    startTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  stream3: {
    id: 'stream3',
    title: 'Music Production Session',
    streamer: 'Audio Pro',
    description: 'Watch a professional producer create music from scratch. Learn about mixing, mastering, and sound design techniques used in modern production.',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
    viewers: 3421,
    isLive: true,
    startTime: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  stream4: {
    id: 'stream4',
    title: 'Coding Challenge',
    streamer: 'Code Masters',
    description: 'Live coding competition with real-time problem solving. Join our host as they tackle algorithmic challenges and explain their thought process.',
    thumbnail: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?q=80&w=2070&auto=format&fit=crop',
    viewers: 987,
    isLive: true,
    startTime: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  recent1: {
    id: 'recent1',
    title: 'AI Research Symposium',
    streamer: 'Future Tech Labs',
    description: 'Recorded presentation of cutting-edge AI research from leading experts in the field. Includes discussion of machine learning advancements and ethical considerations.',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop',
    viewers: 12453,
    isLive: false,
    startTime: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  recent2: {
    id: 'recent2',
    title: 'Marketing Strategies for 2024',
    streamer: 'Growth Hackers',
    description: 'Comprehensive overview of effective digital marketing strategies for the coming year. Learn about SEO, content marketing, and social media optimization.',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    viewers: 7845,
    isLive: false,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  recent3: {
    id: 'recent3',
    title: 'Product Design Evolution',
    streamer: 'Design Leads',
    description: 'Historical journey through the evolution of product design principles. Analysis of iconic designs and their impact on modern design thinking.',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    viewers: 5632,
    isLive: false,
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  recent4: {
    id: 'recent4',
    title: 'Remote Collaboration Workshop',
    streamer: 'Workplace Future',
    description: 'Practical workshop on tools and techniques for effective remote team collaboration. Includes demonstrations of project management and communication platforms.',
    thumbnail: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2069&auto=format&fit=crop',
    viewers: 3211,
    isLive: false,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(), // 5 days ago
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  }
};

// Get recommended streams based on current stream
const getRecommendedStreams = (currentId: string) => {
  return Object.values(STREAMS)
    .filter(stream => stream.id !== currentId)
    .slice(0, 3);
};

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format time function
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const Player: React.FC = () => {
  const { streamId = 'featured' } = useParams();
  const [stream, setStream] = useState(STREAMS[streamId as keyof typeof STREAMS]);
  const [isLiked, setIsLiked] = useState(false);
  const [viewerCount, setViewerCount] = useState<number>(stream?.viewers || 0);

  useEffect(() => {
    // Update stream when streamId changes
    const currentStream = STREAMS[streamId as keyof typeof STREAMS];
    if (currentStream) {
      setStream(currentStream);
      setViewerCount(currentStream.viewers || 0);
      setIsLiked(false);
      window.scrollTo(0, 0);
    }
  }, [streamId]);

  // Simulate viewer count fluctuations for live streams
  useEffect(() => {
    if (stream?.isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          // Random fluctuation between -10 and +20 viewers
          const change = Math.floor(Math.random() * 30) - 10;
          return Math.max(10, prev + change); // Ensure at least 10 viewers
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [stream]);

  if (!stream) {
    return <div>Stream not found</div>;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const handleLike = () => {
    setIsLiked(prev => !prev);
    if (!isLiked) {
      toast.success("Added to your favorites!");
    }
  };

  const recommendedStreams = getRecommendedStreams(stream.id);

  return (
    <div className="min-h-screen pt-16">
      <div className="page-container">
        <div className="mb-4">
          <Button variant="ghost" asChild className="group -ml-3">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Video player */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <VideoPlayer 
                src={stream.hlsUrl} 
                poster={stream.thumbnail}
                title={stream.title}
                autoPlay={true} 
              />
            </div>

            {/* Stream metadata */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{stream.title}</h1>
                  <p className="text-lg text-muted-foreground">{stream.streamer}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-10 w-10 rounded-full"
                  >
                    <Share2 size={18} />
                  </Button>
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="icon"
                    onClick={handleLike}
                    className={`h-10 w-10 rounded-full ${isLiked ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}`}
                  >
                    <Heart size={18} className={isLiked ? "text-white fill-white" : ""} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{viewerCount.toLocaleString()} {stream.isLive ? 'watching' : 'views'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(stream.startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{formatTime(stream.startTime)}</span>
                </div>
                {stream.isLive && (
                  <div className="live-indicator">
                    LIVE
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">About this stream</h3>
                <p className="text-muted-foreground">{stream.description}</p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                  <MessageSquare size={18} />
                  Join Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Recommended Streams</h3>
            
            <div className="space-y-4 animate-slide-up">
              {recommendedStreams.map((rec, index) => (
                <StreamCard
                  key={rec.id}
                  id={rec.id}
                  title={rec.title}
                  streamer={rec.streamer}
                  thumbnail={rec.thumbnail}
                  viewers={rec.viewers}
                  isLive={rec.isLive}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
