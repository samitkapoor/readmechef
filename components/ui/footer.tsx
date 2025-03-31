'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const contacts = [
    {
      name: 'Email',
      id: 'samitkapoor77@gmail.com',
      link: 'mailto:samitkapoor77@gmail.com',
      logo: '/contacts/email.png'
    },
    {
      name: 'Github',
      id: 'samitkapoor',
      link: 'https://github.com/samitkapoor',
      logo: '/contacts/github.svg'
    },
    {
      name: 'Peerlist',
      id: 'samitkapoor',
      link: 'https://peerlist.io/samitkapoor',
      logo: '/contacts/peerlist.svg'
    },
    {
      name: 'Dev.to',
      id: 'samitkapoor',
      link: 'https://dev.to/samitkapoor',
      logo: '/contacts/dev.svg'
    },
    {
      name: 'X',
      id: 'samitkapoorr',
      link: 'https://x.com/samitkapoorr',
      logo: '/contacts/twitter.png'
    },
    {
      name: 'Linkedin',
      id: 'Samit Kapoor',
      link: 'https://linkedin.com/in/samit-kapoor',
      logo: '/contacts/linkedin.png'
    },
    {
      name: 'Instagram',
      id: 'im_samit',
      link: 'https://instagram.com/im_samit',
      logo: '/contacts/instagram.png'
    },
    {
      name: 'Buy Me a Coffee',
      id: 'samitkapoow',
      link: 'https://buymeacoffee.com/samitkapoow',
      logo: '/contacts/buymeacoffee.svg'
    }
  ];

  return (
    <footer className="bg-black/95 text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-20">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:justify-between items-center">
        {/* Logo and description section */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-auto lg:max-w-sm">
          <div className="flex items-center gap-2">
            <ChefHat size={40} className="text-primary" />
            <p className="text-2xl font-bold">ReadMeChef</p>
          </div>
          <p className="text-white/80">Cooking the perfect README Every Single Time</p>

          {/* Social media links */}
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-auto lg:max-w-sm">
          <p className="text-white/80">
            Made with ❤️ by{' '}
            <a href="https://samitkapoor.com" target="_blank" className="text-secondary underline">
              Samit Kapoor
            </a>
          </p>
          <div className="flex items-center flex-wrap gap-4 relative animate-fadeIn">
            {contacts.map((contact, i) => {
              return (
                <div
                  key={i + 'contact'}
                  className="flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <button
                    onClick={() => {
                      window.open(contact.link, '_blank');
                    }}
                    className="relative group"
                  >
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded text-xs text-yellow-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {contact.name}
                    </span>
                    <Image
                      style={{
                        filter: contact.name === 'Linkedin' ? 'brightness(1.2)' : 'brightness(1.1)'
                      }}
                      src={contact.logo || ''}
                      height={100}
                      width={100}
                      alt={contact.name}
                      className="w-6 h-6 object-contain transition-all duration-300 group-hover:brightness-125"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Samit Kapoor. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
