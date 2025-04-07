'use client';

import React from 'react';
import { Github, Lock, Sparkles } from 'lucide-react';
import LandingText from './ui/LandingText';
import MovingBorderCard from './ui/MovingBorderCard';

const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) => {
  return (
    <div className="p-8 flex flex-col items-start gap-4 bg-gradient-to-tr from-black to-black h-full w-full hover:bg-gradient-to-tr hover:from-[#1c1c1c] hover:via-black hover:to-[#1c1c1c] transition-all duration-300">
      <div className="p-4 bg-primary/20 rounded-full">{icon}</div>
      <h3 className="text-xl lg:text-2xl font-semibold text-white/90">{title}</h3>
      <p className="text-white/80 text-sm lg:text-base leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="text-secondary w-8 h-8" />,
      title: 'One-Click Generation',
      description: (
        <>
          Connect your GitHub account and generate professional, comprehensive READMEs with a{' '}
          <span className="text-primary font-medium">single click</span> -{' '}
          <span className="text-primary font-medium">no more spending hours</span> on documentation.
        </>
      )
    },
    {
      icon: <Github className="text-secondary w-8 h-8" />,
      title: 'Smart Repository Analysis',
      description: (
        <>
          Our AI scans your GitHub repository,{' '}
          <span className="text-primary font-medium">
            analyzes code structure, dependencies, and purpose
          </span>{' '}
          to craft a <span className="text-primary font-medium">perfectly tailored README</span>{' '}
          that accurately represents your project.
        </>
      )
    },
    {
      icon: <Lock className="text-secondary w-8 h-8" />,
      title: 'Public & Private Access',
      description: (
        <>
          Choose between <span className="text-primary font-medium">basic access</span> for public
          repositories or <span className="text-primary font-medium">extended access</span> for both
          public and private repos, giving you{' '}
          <span className="text-primary font-medium">full control</span> over your GitHub
          integration.
        </>
      )
    }
  ];

  return (
    <section className="w-full flex items-center justify-center">
      <div className="max-w-[1200px] flex flex-col items-center justify-center border-[1px] border-neutral-700 border-y-0 w-full bg-background">
        <div>
          <LandingText>Craft Perfect READMEs in Seconds</LandingText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-neutral-700 border-b-[1px] border-neutral-700">
            {features.map((feature, index) => (
              <MovingBorderCard
                wrapperClassName={index === 1 ? '!p-[2px]' : '!p-[0px]'}
                className="h-full"
                key={index}
              >
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </MovingBorderCard>
            ))}
          </div>

          <LandingText className="!border-y-0 !border-b-0 border-neutral-700">
            Stop spending hours writing documentation. Let AI do the heavy lifting.
          </LandingText>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
