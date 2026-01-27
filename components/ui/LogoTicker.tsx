
import React from 'react';

const LogoTicker = ({ label }: { label: string }) => {
  const logos = [
    { name: "Acme Corp", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Global Tech", src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "Nebula", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png" },
    { name: "Starlight", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Orbit", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
    { name: "Vortex", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png" },
  ];

  return (
    <div className="py-12 bg-white border-b border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">{label}</p>
      </div>
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
             <img key={idx} src={logo.src} alt={logo.name} className="h-8 md:h-10 w-auto object-contain shrink-0" />
          ))}
        </div>
        <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {[...logos, ...logos, ...logos].map((logo, idx) => (
             <img key={`dup-${idx}`} src={logo.src} alt={logo.name} className="h-8 md:h-10 w-auto object-contain shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
