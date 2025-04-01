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
    <section className="relative px-6 md:px-10 pt-[100px] flex flex-col items-center w-screen overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center justify-center w-full lg:w-1/2 pl-0 lg:pl-10 z-10 pb-10 lg:pb-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-center text-3xl lg:text-4xl xl:text-5xl mt-8 text-white/90 font-light">
            Cooking the perfect README
            <span className="block mt-2 font-medium text-primary">Every Single Time</span>
          </h1>

          <h2 className="text-center mt-4 text-white/70  leading-relaxed">
            ReadMeChef is an AI-powered README generator that helps you <br /> create professional
            documentation for your projects in minutes.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          <GradientButton
            onClick={() => router.push('/login')}
            className="px-8 py-3 rounded-xl text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Get started
          </GradientButton>
          <GradientButton
            onClick={() => router.push('/login')}
            className="px-8 py-3 rounded-xl text-lg font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Watch Demo
          </GradientButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-screen mt-8 relative flex items-start justify-start z-10 overflow-hidden"
      >
        <div
          style={{
            clipPath: 'inset(0 0 50% 0)'
          }}
          className="row-span-1 w-screen flex items-start justify-center overflow-hidden h-[800px]"
        >
          <BrowserWindow
            url="readmechef.com"
            className="border border-gray-800/50 h-full max-w-[1300px] w-full"
            childrenClassName="flex items-center justify-center relative"
          >
            <div className="flex relative flex-col h-[700px] w-[800px] py-10 bg-neutral-800 p-10 shadow-2xl shadow-black rounded-lg my-4">
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
        <div
          style={{
            clipPath: 'inset(50% 0 0 0)'
          }}
          className="row-span-1 w-screen flex items-start justify-center overflow-hidden h-[800px] absolute bottom-0"
        >
          <div className="h-full max-w-[1300px] w-full flex items-center justify-center border-[1px] border-neutral-700">
            <div className="h-full w-[800px] p-10 border-[1px] border-neutral-700 border-b-0"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
