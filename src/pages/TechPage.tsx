
import React from 'react';
import StreamPage from '@/components/StreamPage';

const TechPage: React.FC = () => {
  return (
    <StreamPage
      title="Tech Today Live"
      hlsUrl="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
      description="Dive into the world of technology with our tech-focused live stream. We cover the latest product launches, tech news, reviews, and interviews with industry innovators and thought leaders."
      category="Technology"
    />
  );
};

export default TechPage;
