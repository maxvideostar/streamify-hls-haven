
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Sample streams with different HLS sources
const STREAMS_BY_CATEGORY = {
  sports: [
    {
      id: 'sport1',
      title: 'Live Football Match',
      streamer: 'Sports Channel',
      hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    },
    {
      id: 'sport2',
      title: 'Basketball Tournament',
      streamer: 'NBA Streams',
      hlsUrl: 'https://playertest.longtailvideo.com/adaptive/elephants_dream/elephants_dream.m3u8'
    }
  ],
  entertainment: [
    {
      id: 'ent1',
      title: 'Music Festival Live',
      streamer: 'Music Channel',
      hlsUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8'
    },
    {
      id: 'ent2',
      title: 'Live Talk Show',
      streamer: 'Entertainment Network',
      hlsUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    }
  ],
  news: [
    {
      id: 'news1',
      title: 'Breaking News',
      streamer: 'News Network',
      hlsUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
    },
    {
      id: 'news2',
      title: 'World News',
      streamer: 'Global News',
      hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    }
  ],
  movies: [
    {
      id: 'movie1',
      title: 'Big Buck Bunny',
      streamer: 'Movie Channel',
      hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
    },
    {
      id: 'movie2',
      title: 'Elephant Dream',
      streamer: 'Cinema Stream',
      hlsUrl: 'https://playertest.longtailvideo.com/adaptive/elephants_dream/elephants_dream.m3u8'
    }
  ]
};

const MultiPlayer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter streams based on search term
  const filterStreams = (streams: any[]) => {
    if (!searchTerm) return streams;
    return streams.filter(stream => 
      stream.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      stream.streamer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get all streams for search functionality
  const getAllStreams = () => {
    return Object.values(STREAMS_BY_CATEGORY).flat();
  };

  return (
    <div className="min-h-screen pt-16 pb-10 bg-background">
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="group -ml-3">
              <div onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                Back
              </div>
            </Button>
            <h1 className="text-3xl font-bold">NetStreaming</h1>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="w-full pl-10"
              placeholder="Search streams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Separator className="mb-6" />

        {searchTerm ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterStreams(getAllStreams()).map((stream) => (
                <div key={stream.id} className="flex flex-col space-y-2 bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <VideoPlayer
                    src={stream.hlsUrl}
                    title={stream.title}
                    autoPlay={false}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{stream.title}</h3>
                    <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                  </div>
                </div>
              ))}
            </div>
            {filterStreams(getAllStreams()).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No streams found matching "{searchTerm}"</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="sports" className="w-full">
            <TabsList className="mb-6 w-full flex justify-start overflow-x-auto">
              <TabsTrigger value="sports">Sports</TabsTrigger>
              <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sports" className="mt-0">
              <h2 className="text-2xl font-semibold mb-4">Sports Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STREAMS_BY_CATEGORY.sports.map((stream) => (
                  <div key={stream.id} className="flex flex-col space-y-2 bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <VideoPlayer
                      src={stream.hlsUrl}
                      title={stream.title}
                      autoPlay={false}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="entertainment" className="mt-0">
              <h2 className="text-2xl font-semibold mb-4">Entertainment Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STREAMS_BY_CATEGORY.entertainment.map((stream) => (
                  <div key={stream.id} className="flex flex-col space-y-2 bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <VideoPlayer
                      src={stream.hlsUrl}
                      title={stream.title}
                      autoPlay={false}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="news" className="mt-0">
              <h2 className="text-2xl font-semibold mb-4">News Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STREAMS_BY_CATEGORY.news.map((stream) => (
                  <div key={stream.id} className="flex flex-col space-y-2 bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <VideoPlayer
                      src={stream.hlsUrl}
                      title={stream.title}
                      autoPlay={false}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="movies" className="mt-0">
              <h2 className="text-2xl font-semibold mb-4">Movie Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STREAMS_BY_CATEGORY.movies.map((stream) => (
                  <div key={stream.id} className="flex flex-col space-y-2 bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <VideoPlayer
                      src={stream.hlsUrl}
                      title={stream.title}
                      autoPlay={false}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.streamer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MultiPlayer;
