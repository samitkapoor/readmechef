'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
      className="flex gap-5 items-start"
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
    <section className="w-full py-28 px-6 md:px-10 bg-white dark:bg-black/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white/90 mb-6">
            Why Every Project Needs a Great README
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A well-crafted README is essential for your project&apos;s success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
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
