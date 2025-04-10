'use client';

import React from 'react';
import { Github, Lock, Sparkles } from 'lucide-react';
import LandingText from './ui/LandingText';

const FeatureCard = ({
  icon,
  title,
  description,
  className
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`p-6 flex flex-col rounded-lg border-[2px] border-primary/20 bg-primary/5 items-start gap-4 h-full w-full ${className}`}
    >
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
      <div className="max-w-[1200px] flex flex-col items-center justify-center w-full bg-background">
        <LandingText>Craft Perfect READMEs in Seconds</LandingText>
        <p className="text-sm sm:text-base text-center mt-4 max-w-[700px] text-white/80">
          Professional documentation without the hassle. Let AI analyze your code and create READMEs
          that truly represent your project.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
