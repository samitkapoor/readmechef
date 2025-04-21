'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import GradientButton from './ui/GradientButton';
import BrowserWindow from './ui/browser-window';
import ShineButton from './ui/ShineButton';
import HintText from './ui/HintText';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative px-6 md:px-10 pt-[100px] flex flex-col items-center w-screen max-h-screen overflow-hidden bg-background h-full">
      <motion.div
        animate={{
          background: [
            'linear-gradient(-10deg, rgba(87, 203, 91, 0.05), rgba(2, 11, 5, 0.8))',
            'linear-gradient(-20deg, rgba(87, 203, 91, 0.10), rgba(2, 11, 5, 0.2))',
            'linear-gradient(-15deg, rgba(87, 203, 91, 0.15), rgba(2, 11, 5, 0.6))',
            'linear-gradient(-10deg, rgba(87, 203, 91, 0.2), rgba(2, 11, 5, 0.5))'
          ]
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 10,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 w-screen h-screen"
      />
      <div className="w-screen flex flex-col items-center justify-center z-10 px-4">
        <div className="flex flex-col items-center justify-center w-full pl-0 lg:pl-10 z-10 pb-10 lg:pb-0 mb-20 md:mb-0">
          {/* <div
            onClick={() => {
              router.push(
                'https://www.producthunt.com/posts/readmechef?utm_source=other&utm_medium=social'
              );
            }}
            className="backdrop-blur-xl px-5 py-3 rounded-full cursor-pointer bg-white/10  flex items-center gap-1 group hover:shadow-xl transition-all duration-300 hover:shadow-[#F9615699] mt-5"
          >
            <Image
              src="/contacts/producthunt.svg"
              alt="peerlist"
              width={20}
              height={20}
              className="group-hover:ml-2 transition-all duration-300"
            />
            <p className="text-sm ml-0.5 group-hover:ml-1.5 transition-all duration-300">
              Find us on Product Hunt
            </p>
            <ArrowRight className="w-4 h-4 -rotate-45 group-hover:ml-1 group-hover:rotate-0 transition-all duration-300" />
          </div> */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1
            }}
            style={{
              backgroundImage:
                'linear-gradient(to right, #FFFFFFD0 10%, #FFFFFFA0 20%, #ffffff 35%, #ffffff 70%, #FFFFFFA0 80%, #FFFFFFA0 85%, #FFFFFFD0)'
            }}
            className="bg-clip-text text-transparent text-center text-2xl sm:text-4xl md:text-5xl p-2 lg:text-6xl xl:text-7xl font-semibold mt-10"
          >
            Cooking the perfect README <br />
            <span className="font-bold text-transparent">Every Single Time</span>
          </motion.h1>
          <motion.h4
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.3
            }}
            className="text-xs sm:text-base text-center max-w-[750px] px-3 mt-4"
          >
            AI-powered README generation, simplified. Connect your GitHub or GitLab, choose your
            repository, and let ReadmeChef create a tailored README all without a manual input.
          </motion.h4>

          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.6
            }}
            className="mt-8 flex items-center justify-center gap-2 relative"
          >
            <GradientButton onClick={() => router.push('/login')} className="hover:scale-105">
              Get started
            </GradientButton>
            <ShineButton onClick={scrollToDemo} className="shadow-xl shadow-primary/30">
              Watch Demo
            </ShineButton>
            <HintText text={'Press G'} className="absolute top-full left-0 ml-1 mt-1" />
          </motion.div>
        </div>

        <div className="w-screen mt-16 relative items-center justify-center z-10 overflow-hidden hidden md:flex flex-col">
          <div className="row-span-1 w-screen flex items-start justify-center overflow-hidden">
            <BrowserWindow
              url="readmechef.com"
              className="border border-gray-800/50 h-full md:max-w-[700px] lg:max-w-[1200px] w-full"
              childrenClassName="flex items-center justify-center relative"
            >
              <Image
                src="/hero-illustration-image.png"
                alt="readmechef"
                width={1920}
                height={1080}
              />
            </BrowserWindow>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
