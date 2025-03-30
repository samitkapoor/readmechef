'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Code } from 'lucide-react';

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
      className="bg-card backdrop-blur-sm rounded-2xl p-8 flex flex-col items-start gap-4 border border-white/[0.07] hover:border-white/[0.1] transition-all duration-300"
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
    <section className="w-full py-28 px-6 md:px-10 bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/90"
          >
            Craft Perfect READMEs in Seconds
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-3xl mx-auto mt-5"
          >
            Stop spending hours writing documentation. Let AI do the heavy lifting.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </section>
  );
};

export default FeaturesSection;
