'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import LandingText from './ui/LandingText';

type BenefitProps = {
  title: string;
  description: string;
  index: number;
};

const Benefit = ({ title, description, index }: BenefitProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="flex gap-5 items-start bg-black w-full h-full p-12"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="bg-primary/30 rounded-full p-1.5">
          <Check className="w-5 h-5 text-secondary" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-black dark:text-white/90 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const WhyReadmeSection = () => {
  const benefits = [
    {
      title: 'First Impressions Matter',
      description:
        'A README is often the first thing people see when visiting your repository. Make it count!'
    },
    {
      title: 'Saves Support Time',
      description:
        'Well-documented projects receive fewer support requests, saving you valuable time.'
    },
    {
      title: 'Improves Project Adoption',
      description:
        'Projects with clear documentation have 50% higher adoption rates than those without.'
    },
    {
      title: 'Attracts Contributors',
      description: 'Clear documentation makes it easier for others to contribute to your project.'
    }
  ];

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <div className="max-w-[1300px] w-full">
        <LandingText className="border-t-0 border-[1px] border-neutral-700 border-b-0 w-full">
          Why Every Project Needs a Great README
          <br />A well-crafted README is essential for your project&apos;s success.
        </LandingText>

        <div className="grid grid-cols-1 md:grid-cols-2 border-[1px] border-neutral-700 border-t-0 gap-[1px] bg-neutral-700 w-full">
          {benefits.map((benefit, index) => (
            <Benefit
              key={index}
              title={benefit.title}
              description={benefit.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyReadmeSection;
