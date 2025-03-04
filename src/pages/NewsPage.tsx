
import React from 'react';
import StreamPage from '@/components/StreamPage';

const NewsPage: React.FC = () => {
  return (
    <StreamPage
      title="24/7 News Coverage"
      hlsUrl="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
      description="Stay informed with our continuous news broadcast. Our team of journalists brings you breaking stories, in-depth reporting, and exclusive interviews as they happen."
      category="News"
    />
  );
};

export default NewsPage;
