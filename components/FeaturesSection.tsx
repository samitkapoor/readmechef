'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Code } from 'lucide-react';
import LandingText from './ui/LandingText';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      viewport={{ once: true }}
      className="p-8 flex flex-col items-start gap-4 bg-black"
    >
      <div className="p-4 bg-primary/20 rounded-full">{icon}</div>
      <h3 className="text-xl md:text-2xl font-semibold text-white/90">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="text-secondary w-8 h-8" />,
      title: 'AI-Powered Generation',
      description:
        'Our advanced AI analyzes your project and generates a comprehensive README tailored to your specific needs.'
    },
    {
      icon: <Code className="text-secondary w-8 h-8" />,
      title: 'Code Integration',
      description: 'Seamlessly integrate with GitHub to automatically update your README files.'
    },
    {
      icon: <FileText className="text-secondary w-8 h-8" />,
      title: 'Customizable Templates',
      description:
        "Choose from a variety of templates or create your own to match your project's style and requirements."
    }
  ];

  return (
    <section className="w-full flex items-center justify-center">
      <div className="max-w-[1300px] flex flex-col items-center justify-center border-[1px] border-neutral-700 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <LandingText>
            Craft Perfect READMEs in Seconds
            <br />
            Stop spending hours writing documentation. Let AI do the heavy lifting.
          </LandingText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-neutral-700">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
