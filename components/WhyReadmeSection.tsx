'use client';

import React from 'react';

import { TrendingUp, GitPullRequest, Clock, Award, Wrench, Users } from 'lucide-react';
import LandingText from './ui/LandingText';

type BenefitProps = {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
};

const Benefit = ({ title, description, icon }: BenefitProps) => {
  return (
    <div
      className={`p-6 flex flex-col rounded-lg border-[2px] border-primary/20 bg-primary/5 items-start gap-4 h-full w-full`}
    >
      <div className="p-4 bg-primary/20 rounded-full">{icon}</div>
      <h3 className="text-xl lg:text-2xl font-semibold text-white/90">{title}</h3>
      <p className="text-white/80 text-sm lg:text-base leading-relaxed">{description}</p>
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
          <span className="text-primary font-medium">60% more traffic</span>. GitHub&apos;s own
          research shows README quality directly{' '}
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
          according to GitHub&apos;s 2021 Open Source Survey.
        </>
      )
    },
    {
      title: 'Reduces Onboarding Time by 68%',
      icon: <Clock className="w-8 h-8 text-secondary" />,
      description: (
        <>
          According to Stack Overflow&apos;s Developer Survey, detailed READMEs with clear
          installation and usage instructions{' '}
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
          <span className="text-primary font-medium">72% of developers</span> report they won&apos;t
          use or contribute to a project without a proper README, regardless of code quality. This
          makes it the{' '}
          <span className="text-primary font-medium">single most important trust signal</span> for
          open-source projects.
        </>
      )
    },
    {
      title: 'Improves Project Maintenance',
      icon: <Wrench className="w-8 h-8 text-secondary" />,
      description: (
        <>
          Projects with comprehensive READMEs experience{' '}
          <span className="text-primary font-medium">45% fewer maintenance issues</span> and{' '}
          <span className="text-primary font-medium">reduced technical debt</span>. Clear
          documentation helps maintain consistency and makes future updates more efficient.
        </>
      )
    },
    {
      title: 'Fosters Community Growth',
      icon: <Users className="w-8 h-8 text-secondary" />,
      description: (
        <>
          Projects with engaging READMEs that include contribution guidelines and community
          information see{' '}
          <span className="text-primary font-medium">3x higher community engagement</span> and{' '}
          <span className="text-primary font-medium">85% more community discussions</span>, creating
          a vibrant ecosystem around your project.
        </>
      )
    }
  ];

  return (
    <section className="w-full flex flex-col items-center justify-center border-b-[1px] border-primary/40">
      <div className="max-w-[1200px] w-full flex flex-col items-center justify-center">
        <LandingText>Why Every Project Needs a Great README?</LandingText>
        <p className="text-sm sm:text-base text-center mt-4 max-w-[700px] text-white/80">
          A well-crafted README is essential for your project&apos;s success.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-[1px] border-neutral-900/40 gap-2 w-full rounded-3xl mt-12 pb-36">
          {benefits.map((benefit, index) => (
            <Benefit
              key={`benefit-${index}`}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyReadmeSection;
