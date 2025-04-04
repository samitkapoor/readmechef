'use client';

import React from 'react';

import { TrendingUp, GitPullRequest, Clock, Award, Wrench, Users } from 'lucide-react';
import LandingText from './ui/LandingText';
import MatrixCell from './ui/MatrixCell';

type BenefitProps = {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
};

const Benefit = ({ title, description, icon }: BenefitProps) => {
  return (
    <div className="flex flex-col gap-5 items-start bg-gradient-to-tr from-black to-black h-full w-full hover:bg-gradient-to-tr hover:from-[#1c1c1c] hover:via-black hover:to-[#1c1c1c] transition-all duration-300 p-5 lg:p-12">
      <div className="p-4 bg-primary/20 rounded-full">{icon}</div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl lg:text-2xl font-semibold text-white/90">{title}</h3>
        <p className="text-white/80 text-sm lg:text-base leading-relaxed">{description}</p>
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

  // Define the layout pattern (1 for benefit, 0 for empty space)
  const layoutPattern = [
    [1, 1, 0], // First row
    [0, 1, 1], // Second row
    [1, 0, 1] // Third row
  ];

  // Characters for the Matrix beams
  const matrixChars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#*_-+`~[](){}<>|中文字符';

  return (
    <section className="w-full flex flex-col items-center justify-center border-b-[1px] border-primary/40">
      <div className="max-w-[1300px] w-full">
        <LandingText className="border-y-0 !border-b-[1px] border-[1px] border-neutral-700 w-full ">
          Why Every Project Needs a Great README?
        </LandingText>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-[1px] border-neutral-700 border-t-0 gap-[1px] bg-neutral-700 w-full">
          {layoutPattern.flat().map((cell, index) => {
            const rowIndex = Math.floor(index / 3);
            const colIndex = index % 3;

            // Calculate benefit index carefully based on the pattern
            // Count '1's before this cell
            let benefitCounter = 0;
            for (let i = 0; i < index; i++) {
              if (layoutPattern.flat()[i] === 1) {
                benefitCounter++;
              }
            }
            const benefitIndex = benefitCounter;

            return cell === 1 ? (
              <Benefit
                key={`benefit-${rowIndex}-${colIndex}`}
                title={benefits[benefitIndex].title}
                description={benefits[benefitIndex].description}
                icon={benefits[benefitIndex].icon}
              />
            ) : (
              // Render empty cell with Matrix beams
              <MatrixCell key={`empty-${rowIndex}-${colIndex}`} matrixChars={matrixChars} />
            );
          })}
        </div>
        <LandingText className="border-y-0 border-[1px] border-primary/40 border-b-0 w-full">
          A well-crafted README is essential for your project&apos;s success.
        </LandingText>
      </div>
    </section>
  );
};

export default WhyReadmeSection;
