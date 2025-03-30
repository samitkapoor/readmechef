'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CtaSection = () => {
  const router = useRouter();

  return (
    <section className="w-full py-24 px-6 md:px-16 bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Cook Up Perfect READMEs?
        </h2>
        <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join the developers who save time and improve their projects with ReadMeChef.
        </p>

        <motion.button
          onClick={() => router.push('/login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-card text-secondary font-medium px-8 py-4 rounded-md inline-flex items-center gap-2 shadow-lg shadow-blue-800/20 hover:shadow-xl transition-all duration-300"
        >
          Get Started for Free
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CtaSection;
