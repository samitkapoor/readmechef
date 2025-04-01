'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Code, Github, Lock, Sparkles } from 'lucide-react';
import LandingText from './ui/LandingText';
import GridDivider from './ui/GridDivider';
import MovingBorderCard from './ui/MovingBorderCard';

const FeatureCard = ({
  icon,
  title,
  description,
  index
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <div className="p-8 flex flex-col items-start gap-4 bg-black h-full w-full">
      <div className="p-4 bg-primary/20 rounded-full">{icon}</div>
      <h3 className="text-xl md:text-2xl font-semibold text-white/90">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="text-secondary w-8 h-8" />,
      title: 'One-Click Generation',
      description:
        'Connect your GitHub account and generate professional, comprehensive READMEs with a single click - no more spending hours on documentation.'
    },
    {
      icon: <Github className="text-secondary w-8 h-8" />,
      title: 'Smart Repository Analysis',
      description:
        'Our AI scans your GitHub repository, analyzes code structure, dependencies, and purpose to craft a perfectly tailored README that accurately represents your project.'
    },
    {
      icon: <Lock className="text-secondary w-8 h-8" />,
      title: 'Public & Private Access',
      description:
        'Choose between basic access for public repositories or extended access for both public and private repos, giving you full control over your GitHub integration.'
    }
  ];

  return (
    <section className="w-full flex items-center justify-center">
      <div className="max-w-[1300px] flex flex-col items-center justify-center border-[1px] border-neutral-700 border-y-0 w-full bg-background">
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
                  index={index}
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
