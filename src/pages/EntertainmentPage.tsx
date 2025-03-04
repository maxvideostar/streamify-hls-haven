
import React from 'react';
import StreamPage from '@/components/StreamPage';

const EntertainmentPage: React.FC = () => {
  return (
    <StreamPage
      title="Entertainment Tonight"
      hlsUrl="https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
      description="Your daily dose of entertainment news, celebrity interviews, and behind-the-scenes looks at the latest films, TV shows, and music releases. Catch up on all the entertainment world has to offer."
      category="Entertainment"
    />
  );
};

export default EntertainmentPage;
