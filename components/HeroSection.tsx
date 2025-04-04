'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import GradientButton from './ui/GradientButton';
import BrowserWindow from './ui/browser-window';
import TypewriterMarkdown from './TypewriterMarkdown';
import ShineButton from './ui/ShineButton';
import MovingBorderCard from './ui/MovingBorderCard';

const HeroSection = () => {
  const router = useRouter();

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const backgroundCircles = [
    {
      height: 500,
      width: 500,
      className: 'border-y-4 blur-md border-neutral-400',
      animation: 'spin 6s linear infinite'
    },
    {
      height: 700,
      width: 700,
      className: 'border-l-4 blur-md border-neutral-400',
      animation: 'spin 6s linear infinite'
    },
    {
      height: 300,
      width: 300,
      className: 'border-r-4 blur-md border-neutral-400',
      animation: 'spin 1s linear infinite'
    },
    {
      height: 900,
      width: 900,
      className: 'border-l-4 blur-md border-neutral-400',
      animation: 'spin 2s linear infinite'
    }
  ];

  return (
    <section className="relative px-6 md:px-10 pt-[100px] flex flex-col items-center w-screen max-h-screen overflow-hidden bg-background h-full">
      <div
        style={{
          background:
            'radial-gradient(circle, transparent 20%, rgba(0, 255, 0, 0.04) 60%, transparent 100%)'
        }}
        className="w-screen max-h-screen h-full absolute top-0 left-0 flex items-center justify-center"
      >
        {backgroundCircles.map((circle) => (
          <div
            key={circle.height}
            className={`rounded-full absolute ${circle.className}`}
            style={{
              height: circle.height,
              width: circle.width,
              animation: circle.animation
            }}
          ></div>
        ))}
      </div>
      <div className="w-screen max-h-screen flex flex-col items-center justify-center z-10 px-4">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 pl-0 lg:pl-10 z-10 pb-10 lg:pb-0 mb-20 md:mb-0">
          <div>
            <h1 className="text-center text-3xl lg:text-4xl xl:text-5xl text-white/90 font-light mt-20">
              Cooking the perfect README
              <span className="block mt-2 font-medium text-primary">Every Single Time</span>
            </h1>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <GradientButton onClick={() => router.push('/login')} className="hover:scale-105">
              Get started
            </GradientButton>
            <ShineButton onClick={scrollToDemo} className="shadow-xl shadow-primary/30">
              Watch Demo
            </ShineButton>
          </div>
        </div>

        <motion.div
          initial={{ y: 300 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="w-screen mt-12 relative items-start justify-start z-10 overflow-hidden hidden md:flex"
        >
          <div className="row-span-1 w-screen flex items-start justify-center overflow-hidden h-[800px]">
            <BrowserWindow
              url="readmechef.com"
              className="border border-gray-800/50 h-full md:max-w-[700px] lg:max-w-[1300px] w-full"
              childrenClassName="flex items-center justify-center relative"
            >
              <MovingBorderCard wrapperClassName="my-4 rounded-xl">
                <div className="flex relative flex-col h-[700px] w-[500px] lg:w-[800px] py-10 bg-neutral-800 md:p-6 shadow-xl shadow-black rounded-lg">
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
              </MovingBorderCard>
            </BrowserWindow>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
