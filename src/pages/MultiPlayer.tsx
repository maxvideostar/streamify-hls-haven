
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

// Define featured pages
const FEATURED_PAGES = [
  {
    title: "Sports Channel",
    description: "Watch live sports events and competitions from around the world",
    category: "Sports",
    icon: "🏆",
    path: "/sports"
  },
  {
    title: "News Network",
    description: "Stay informed with 24/7 news coverage from global sources",
    category: "News",
    icon: "📰",
    path: "/news"
  },
  {
    title: "Entertainment Tonight",
    description: "Celebrity interviews, movie premiers, and entertainment news",
    category: "Entertainment",
    icon: "🎭",
    path: "/entertainment"
  },
  {
    title: "Classic Movies",
    description: "Enjoy a curated selection of classic and modern films",
    category: "Movies",
    icon: "🎬",
    path: "/movies"
  },
  {
    title: "Tech Today",
    description: "Latest tech news, product reviews, and digital innovation",
    category: "Technology",
    icon: "💻",
    path: "/tech"
  }
];

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

        {/* Featured Channels Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURED_PAGES.map(page => (
              <Card key={page.path} className="hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="text-3xl mb-2">{page.icon}</div>
                    <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {page.category}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{page.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full gap-1">
                    <Link to={page.path}>
                      Watch Now
                      <ExternalLink size={14} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

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
