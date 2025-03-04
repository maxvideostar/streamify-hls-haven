
import React from 'react';
import StreamPage from '@/components/StreamPage';

const SportsPage: React.FC = () => {
  return (
    <StreamPage
      title="Live Sports Stream"
      hlsUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
      description="Watch the latest sporting events from around the world. This channel provides live coverage of major competitions, interviews with athletes, and expert analysis of the games."
      category="Sports"
    />
  );
};

export default SportsPage;
