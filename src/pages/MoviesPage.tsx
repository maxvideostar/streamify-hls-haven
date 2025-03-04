
import React from 'react';
import StreamPage from '@/components/StreamPage';

const MoviesPage: React.FC = () => {
  return (
    <StreamPage
      title="Classic Movies Channel"
      hlsUrl="https://playertest.longtailvideo.com/adaptive/elephants_dream/elephants_dream.m3u8"
      description="Experience the magic of classic cinema on our dedicated movie channel. From timeless masterpieces to forgotten gems, we showcase the films that have shaped the art of moviemaking."
      category="Movies"
    />
  );
};

export default MoviesPage;
