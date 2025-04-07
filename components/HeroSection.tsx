'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import GradientButton from './ui/GradientButton';
import BrowserWindow from './ui/browser-window';
import ShineButton from './ui/ShineButton';
import HintText from './ui/HintText';
import Image from 'next/image';

const HeroSection = () => {
  const router = useRouter();

  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      style={{
        background:
          'linear-gradient(-10deg, #57cb5b0A, #020b05), radial-gradient(circle at center left, #57cb5b0A, #020b05)'
      }}
      className="relative px-6 md:px-10 pt-[100px] flex flex-col items-center w-screen overflow-hidden bg-background h-full"
    >
      <div className="w-screen flex flex-col items-center justify-center z-10 px-4">
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 pl-0 lg:pl-10 z-10 pb-10 lg:pb-0 mb-20 md:mb-0">
          <div
            onClick={() => {
              router.push('https://peerlist.io/samitkapoor/project/readmechef');
            }}
            className="mt-10 backdrop-blur-xl px-5 py-3 rounded-lg cursor-pointer bg-gradient-to-br bg-white/15 to-black/20"
          >
            <Image
              src="/peerlist-launch.svg"
              height={200}
              width={150}
              alt="peerlist"
              className=""
            />
          </div>
          <h1
            style={{
              backgroundImage:
                'linear-gradient(to right, #FFFFFFD0 10%, #FFFFFFA0 20%, #ffffff 35%, #ffffff 70%, #FFFFFFA0 80%, #FFFFFFA0 85%, #FFFFFFD0)'
            }}
            className="bg-clip-text text-transparent text-center text-3xl p-2 lg:text-4xl xl:text-5xl font-semibold mt-10"
          >
            Cooking the perfect README <br />
            <span className="font-bold text-transparent">Every Single Time</span>
          </h1>

          <div className="mt-8 flex items-center justify-center gap-2 relative">
            <GradientButton onClick={() => router.push('/login')} className="hover:scale-105">
              Get started
            </GradientButton>
            <ShineButton onClick={scrollToDemo} className="shadow-xl shadow-primary/30">
              Watch Demo
            </ShineButton>
            <HintText text={'Press G'} className="absolute top-full left-0 ml-1 mt-1" />
          </div>
        </div>

        <motion.div
          initial={{ y: 300 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="w-screen mt-12 relative items-start justify-start z-10 overflow-hidden hidden md:flex"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
