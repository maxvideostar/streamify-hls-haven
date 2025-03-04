
import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface StreamPageProps {
  title: string;
  hlsUrl: string;
  description: string;
  category: string;
}

const StreamPage: React.FC<StreamPageProps> = ({ 
  title, 
  hlsUrl, 
  description, 
  category 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 pb-10 bg-background">
      <div className="page-container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="group -ml-3">
              <div onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer">
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                Back
              </div>
            </Button>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {category}
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="grid grid-cols-1 gap-8">
          {/* Main content */}
          <div className="space-y-6 animate-fade-in">
            {/* Video player */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <VideoPlayer 
                src={hlsUrl} 
                title={title}
                autoPlay={true} 
              />
            </div>

            {/* Stream metadata */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <p className="text-lg text-muted-foreground">Live Stream</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="live-indicator">
                  LIVE
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">About this stream</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
