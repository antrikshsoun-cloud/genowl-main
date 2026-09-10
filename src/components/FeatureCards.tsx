import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp } from 'lucide-react';
import ServicesListVisual from './ServicesListVisual.tsx';
import ChartVisual from './ChartVisual.tsx';
import Card3D from './Card3D.tsx';

export default function FeatureCards() {
  const cards = [
    {
      id: 'card-what-we-provide',
      icon: Sparkles,
      title: 'what we provide',
      description: 'Cutting-edge digital solutions tailored to accelerate your business growth.',
      visual: <ServicesListVisual />,
    },
    {
      id: 'card-why-choose-genowl',
      icon: TrendingUp,
      title: 'Why to choose genowl',
      description:
        'in todays world everybody knows that for almost every service possible their is an ai tool but ofcourse they dont have much time to use every tools so here is the point that why you should choose us because all you have to do is buy our service and tell us what to build rest is on us.',
      visual: <ChartVisual />,
    },
  ];

  return (
    <section id="features-section" className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              id={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="h-full"
            >
              <Card3D className="bg-[#0c130d]/85 border border-white/[0.08] hover:border-[#c6f554]/40 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl transition-colors duration-300 min-h-[420px]">
                {/* Subtle top-light gradient reflection */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                {/* Card Header with 3D Pop Depth */}
                <div style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      style={{ transform: 'translateZ(30px)' }}
                      className="w-8 h-8 rounded-xl bg-[#162217] border border-[#c6f554]/30 flex items-center justify-center text-[#c6f554] shadow-[0_0_12px_rgba(198,245,84,0.2)]"
                    >
                      <Icon className="w-4 h-4 fill-[#c6f554]/20" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight capitalize">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Graphic / Content Area with elevated 3D depth */}
                <div
                  style={{ transform: 'translateZ(25px)' }}
                  className="mt-6 pt-2 flex items-center justify-center"
                >
                  {card.visual}
                </div>
              </Card3D>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

