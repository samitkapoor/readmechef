'use client';

import React from 'react';

import { TrendingUp, GitPullRequest, Clock, Award } from 'lucide-react';
import LandingText from './ui/LandingText';

type BenefitProps = {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
};

const Benefit = ({ title, description, icon }: BenefitProps) => {
  return (
    <div className="flex flex-col gap-5 items-start bg-black w-full h-full p-12">
      <div className="p-4 bg-primary/20 rounded-full">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-white/90 mb-2">{title}</h3>
        <p className="text-white/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const WhyReadmeSection = () => {
  const benefits = [
    {
      title: 'Increases Repository Traffic',
      icon: <TrendingUp className="w-8 h-8 text-secondary" />,
      description: (
        <>
          GitHub projects with well-documented READMEs receive up to{' '}
          <span className="text-primary font-medium">60% more traffic</span>. GitHub's own research
          shows README quality directly{' '}
          <span className="text-primary font-medium">correlates with discoverability</span> in
          search rankings.
        </>
      )
    },
    {
      title: 'Boosts Contribution Rates',
      icon: <GitPullRequest className="w-8 h-8 text-secondary" />,
      description: (
        <>
          Open-source projects with comprehensive READMEs see{' '}
          <span className="text-primary font-medium">126% more pull requests</span> on average and
          attract <span className="text-primary font-medium">58% more external contributors</span>,
          according to GitHub's 2021 Open Source Survey.
        </>
      )
    },
    {
      title: 'Reduces Onboarding Time by 68%',
      icon: <Clock className="w-8 h-8 text-secondary" />,
      description: (
        <>
          According to Stack Overflow's Developer Survey, detailed READMEs with clear installation
          and usage instructions{' '}
          <span className="text-primary font-medium">reduce onboarding time by 68%</span> and{' '}
          <span className="text-primary font-medium">decrease abandoned contributions</span>.
        </>
      )
    },
    {
      title: 'Builds Project Credibility',
      icon: <Award className="w-8 h-8 text-secondary" />,
      description: (
        <>
          <span className="text-primary font-medium">72% of developers</span> report they won't use
          or contribute to a project without a proper README, regardless of code quality. This makes
          it the{' '}
          <span className="text-primary font-medium">single most important trust signal</span> for
          open-source projects.
        </>
      )
    }
  ];

  return (
    <section className="w-full flex flex-col items-center justify-center border-b-[1px] border-primary/40">
      <div className="max-w-[1300px] w-full">
        <LandingText className="border-y-0 !border-b-[1px] border-[1px] border-neutral-700 w-full ">
          Why Every Project Needs a Great README?
        </LandingText>

        <div className="grid grid-cols-1 md:grid-cols-2 border-[1px] border-neutral-700 border-t-0 gap-[1px] bg-neutral-700 w-full">
          {benefits.map((benefit, index) => (
            <Benefit
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>
        <LandingText className="border-y-0 border-[1px] border-primary/40 border-b-0 w-full">
          A well-crafted README is essential for your project&apos;s success.
        </LandingText>
      </div>
    </section>
  );
};

export default WhyReadmeSection;
