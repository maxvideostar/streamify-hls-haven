
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircle } from 'lucide-react';
import StreamCard from '@/components/StreamCard';
import { Button } from '@/components/ui/button';

// Mock data for streams
const FEATURED_STREAMS = [
  {
    id: 'featured',
    title: 'Live Product Launch Event',
    streamer: 'Tech Innovations',
    thumbnail: 'https://images.unsplash.com/photo-1603969072881-b0fc7f3d6d7a?q=80&w=2070&auto=format&fit=crop',
    viewers: 24687,
    isLive: true,
    isFeatured: true
  }
];

const LIVE_STREAMS = [
  {
    id: 'stream1',
    title: 'Morning Tech Talk',
    streamer: 'Developer Daily',
    thumbnail: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=2080&auto=format&fit=crop',
    viewers: 1243,
    isLive: true
  },
  {
    id: 'stream2',
    title: 'Design Workshop Live',
    streamer: 'Creative Studios',
    thumbnail: 'https://images.unsplash.com/photo-1581092335878-2d9268b5bada?q=80&w=2070&auto=format&fit=crop',
    viewers: 856,
    isLive: true
  },
  {
    id: 'stream3',
    title: 'Music Production Session',
    streamer: 'Audio Pro',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop',
    viewers: 3421,
    isLive: true
  },
  {
    id: 'stream4',
    title: 'Coding Challenge',
    streamer: 'Code Masters',
    thumbnail: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?q=80&w=2070&auto=format&fit=crop',
    viewers: 987,
    isLive: true
  }
];

const RECENT_STREAMS = [
  {
    id: 'recent1',
    title: 'AI Research Symposium',
    streamer: 'Future Tech Labs',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop',
    viewers: 12453,
    isLive: false
  },
  {
    id: 'recent2',
    title: 'Marketing Strategies for 2024',
    streamer: 'Growth Hackers',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    viewers: 7845,
    isLive: false
  },
  {
    id: 'recent3',
    title: 'Product Design Evolution',
    streamer: 'Design Leads',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    viewers: 5632,
    isLive: false
  },
  {
    id: 'recent4',
    title: 'Remote Collaboration Workshop',
    streamer: 'Workplace Future',
    thumbnail: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2069&auto=format&fit=crop',
    viewers: 3211,
    isLive: false
  }
];

const Index: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1603969072881-b0fc7f3d6d7a?q=80&w=2070&auto=format&fit=crop)`,
            transform: `translateY(${scrollY * 0.2}px)`,
            filter: 'brightness(0.7)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 page-container flex flex-col items-center text-center max-w-4xl">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm border border-primary/20 animate-slide-down">
              Welcome to HLS Haven
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
              Premium Live Streaming Experience
            </h1>
            
            <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-slide-up">
              Broadcast and watch high-quality live streams with the most elegant and reliable HLS streaming platform available.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4 animate-slide-up">
              <Button asChild size="lg" className="transition-transform duration-300 hover:scale-105 shadow-lg">
                <Link to="/player/featured">
                  Watch Featured Stream
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-80">
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 border-r-2 border-b-2 border-white transform rotate-45 translate-y-[-2px]"></div>
          </div>
        </div>
      </section>

      {/* Featured Stream */}
      <section className="py-16 page-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Stream</h2>
          <Button variant="ghost" asChild className="group">
            <Link to="/player/featured" className="flex items-center gap-2">
              View All 
              <ArrowRightCircle size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8 animate-scale-in">
          {FEATURED_STREAMS.map(stream => (
            <StreamCard 
              key={stream.id}
              id={stream.id}
              title={stream.title}
              streamer={stream.streamer}
              thumbnail={stream.thumbnail}
              viewers={stream.viewers}
              isLive={stream.isLive}
              isFeatured={stream.isFeatured}
            />
          ))}
        </div>
      </section>

      {/* Live Streams */}
      <section className="py-16 bg-secondary/50">
        <div className="page-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Live Now</h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/player/stream1" className="flex items-center gap-2">
                View All 
                <ArrowRightCircle size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
            {LIVE_STREAMS.map(stream => (
              <StreamCard 
                key={stream.id}
                id={stream.id}
                title={stream.title}
                streamer={stream.streamer}
                thumbnail={stream.thumbnail}
                viewers={stream.viewers}
                isLive={stream.isLive}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Streams */}
      <section className="py-16 page-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Broadcasts</h2>
          <Button variant="ghost" asChild className="group">
            <Link to="/player/recent1" className="flex items-center gap-2">
              View All 
              <ArrowRightCircle size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
          {RECENT_STREAMS.map(stream => (
            <StreamCard 
              key={stream.id}
              id={stream.id}
              title={stream.title}
              streamer={stream.streamer}
              thumbnail={stream.thumbnail}
              viewers={stream.viewers}
              isLive={stream.isLive}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
        <div className="page-container text-center">
          <div className="glass-panel max-w-3xl mx-auto px-8 py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Streaming?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our platform to broadcast your content to viewers worldwide with high-quality, low-latency HLS streaming.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="shadow-lg transition-transform duration-300 hover:scale-105">
                Get Started
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-sm transition-transform duration-300 hover:scale-105">
                <Link to="/multi-player">
                  View Multiple Players
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/80 py-10 mt-auto">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Link to="/" className="text-xl font-medium text-foreground hover:text-primary transition-colors">
                HLS Haven
              </Link>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/player/featured" className="text-muted-foreground hover:text-foreground transition-colors">
                Featured
              </Link>
              <Link to="/multi-player" className="text-muted-foreground hover:text-foreground transition-colors">
                Multi-Player
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} HLS Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
