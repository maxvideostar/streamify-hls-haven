
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Sample streams with different HLS sources
const SAMPLE_STREAMS = [
  {
    id: 'stream1',
    title: 'Big Buck Bunny',
    streamer: 'Test Stream 1',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id: 'stream2',
    title: 'Elephant Dream',
    streamer: 'Test Stream 2',
    hlsUrl: 'https://playertest.longtailvideo.com/adaptive/elephants_dream/elephants_dream.m3u8'
  },
  {
    id: 'stream3',
    title: 'Bip Bop',
    streamer: 'Test Stream 3',
    hlsUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8'
  },
  {
    id: 'stream4',
    title: 'Tears of Steel',
    streamer: 'Test Stream 4',
    hlsUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
  },
  {
    id: 'stream5',
    title: 'Sintel',
    streamer: 'Test Stream 5',
    hlsUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
  }
];

const MultiPlayer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 pb-10">
      <div className="page-container">
        <div className="mb-4">
          <Button variant="ghost" asChild className="group -ml-3">
            <div onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Back
            </div>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Multiple HLS Players</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SAMPLE_STREAMS.map((stream) => (
            <div key={stream.id} className="flex flex-col space-y-2">
              <VideoPlayer
                src={stream.hlsUrl}
                title={stream.title}
                autoPlay={false}
              />
              <div className="mt-2">
                <h3 className="text-lg font-semibold">{stream.title}</h3>
                <p className="text-sm text-muted-foreground">{stream.streamer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiPlayer;
