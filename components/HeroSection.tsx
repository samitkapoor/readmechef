'use client';

import { ChefHatIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import GradientButton from './ui/GradientButton';
import BrowserWindow from './ui/browser-window';
import TypewriterMarkdown from './TypewriterMarkdown';

const HeroSection = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mounting
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pb-16 px-6 md:px-10 pt-[100px] flex flex-col lg:flex-row items-start justify-between min-h-[calc(100vh-100px)] w-full overflow-hidden bg-background">
      {/* Left side - Text content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center lg:items-start justify-center lg:justify-between w-full lg:w-1/2 pl-0 lg:pl-10 z-10 pb-10 lg:pb-0 mt-5 md:mt-10"
      >
        <div className="mt-10 flex items-center justify-center p-4 md:p-5 border-2 border-secondary/70 bg-secondary/10 rounded-full shadow-lg shadow-secondary/5 backdrop-blur-sm ">
          <div>
            <ChefHatIcon size={80} className="text-primary drop-shadow-lg" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-center lg:text-left text-3xl lg:text-4xl xl:text-5xl mt-8 text-white/90 font-medium">
            Cooking the perfect README
          </h1>

          <h1 className="text-center lg:text-left text-3xl lg:text-4xl xl:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mt-2 pb-1">
            Every Single Time
          </h1>

          <h2 className="text-center lg:text-left mt-10 text-lg text-white/70 max-w-xl leading-relaxed">
            ReadMeChef is an AI-powered README generator that helps you create professional
            documentation for your projects in minutes.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <GradientButton
            onClick={() => router.push('/login')}
            className="px-8 py-3 rounded-xl text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Get started for free
          </GradientButton>

          <p className="text-white/50 text-sm mt-4 font-medium text-center lg:text-left ">
            No credit card required
          </p>
        </motion.div>
      </motion.div>

      {/* Right side - Browser preview */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full lg:w-1/2 py-5 md:py-10 relative flex items-center justify-center z-10"
      >
        <div className="w-full max-w-2xl hidden sm:block md:h-[700px]">
          <BrowserWindow
            url="readmechef.com"
            className="shadow-2xl shadow-black/30 border border-gray-800/50 h-full"
          >
            <div className="h-full w-full flex flex-col p-5">
              <TypewriterMarkdown
                typingSpeed={150}
                charSpeed={5}
                content={`
# ReadMeChef
---

ReadMeChef is an AI powered README generator that helps you create the perfect README.

## Features

- **AI-Powered**: Leverage the power of AI to generate comprehensive and beautiful README files.
- **Customizable**: Tailor the README to fit your project's unique needs.
- **Quick and Easy**: Generate a professional README in minutes.

### Getting Started

1. **Sign Up**: Create an account on ReadMeChef.
2. **Connect Repository**: Link your GitHub repository.
3. **Generate README**: Let the AI do the magic.

#### Example

> "ReadMeChef transformed my project's documentation. It's quick, easy, and the results are fantastic!" - Satisfied User

---

For more information, visit [ReadMeChef](https://readmechef.com).


`}
              />
            </div>
          </BrowserWindow>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
