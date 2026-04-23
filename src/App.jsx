import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Phone, MapPin, Globe, ArrowRight, Award, Clock, Heart, GlassWater } from 'lucide-react';
import InquiryForm from './components/InquiryForm';

function App() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="bg-obsidian text-white selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center glass-panel border-b-0">
        <div className="text-2xl font-bold font-serif tracking-widest gold-gradient">OGAPIRO</div>
        <div className="hidden md:flex space-x-12 text-sm uppercase tracking-widest font-medium">
          <a href="#story" className="hover:text-gold transition-colors">Story</a>
          <a href="#quality" className="hover:text-gold transition-colors">Quality</a>
          <a href="#inquiry" className="hover:text-gold transition-colors">Contact</a>
        </div>
        <a href="#inquiry" className="border border-gold/30 px-6 py-2 rounded-full text-xs hover:bg-gold hover:text-black transition-all">PROJECT INQUIRY</a>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian/50 to-obsidian z-10"></div>
          <img 
            src="/assets/hero.png" 
            alt="Ogapiro Bottle" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-20 text-center px-6">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.5 }}
            className="text-gold uppercase text-sm mb-6"
          >
            Chosun Hangdo-ga
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-8xl font-serif font-black mb-8 leading-tight"
          >
            조선행도가 <br/> <span className="gold-gradient">오가피로</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-12"
          >
            보존료 없이 빚은 프리미엄 오가피 와인 <br/>
            세월로 빚어낸 오가피의 깊은 숨결을 경험하십시오.
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1.5 }}
          >
            <a href="#story" className="group flex items-center justify-center space-x-3 text-gold">
              <span className="uppercase tracking-[0.3em] text-xs">Explore the Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>
      </header>

      {/* Story Section */}
      <section id="story" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden premium-border"
          >
            <img src="/assets/story_1.png" alt="Raw Materials" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10">
              <span className="text-gold text-4xl font-serif mb-2 block">01</span>
              <h3 className="text-3xl font-bold">원료의 가치</h3>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Award className="text-gold w-12 h-12" />
            <h2 className="text-4xl font-serif leading-snug">품질 좋은 오가피를 엄선하여 <br/> 완성된 고귀한 한 방울</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              오랜 세월 귀하게 여겨온 원재료의 깊은 가치를 담았습니다. 
              최고급 오가피 열매만을 수확하여 자연 그대로의 성분을 보존하기 위해 정성을 다합니다.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, order: 2 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8 md:order-1"
          >
            <Clock className="text-gold w-12 h-12" />
            <h2 className="text-4xl font-serif leading-snug">기다림의 미학, <br/> 발효와 숙성의 시간</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              천천히 숙성되는 전통 발효 과정을 통해 인위적인 가공 없이도 
              부드럽고 깊은 맛을 완성합니다. 시간이 빚어낸 완벽한 균형을 느껴보세요.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden premium-border md:order-2"
          >
            <img src="/assets/story_2.png" alt="Premium Gift Set" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10">
              <span className="text-gold text-4xl font-serif mb-2 block">02</span>
              <h3 className="text-3xl font-bold">발효의 시간</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-emerald-dark/10 py-32 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-12">
          <Heart className="mx-auto text-gold w-12 h-12" />
          <h2 className="text-5xl font-serif italic">"나를 아끼는 습관, 오늘은 오가피로"</h2>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            건강한 몸과 마음을 위한 선택. <br/>
            첨가물 없이 빚어낸 순수한 오가피의 힘이 당신의 하루를 깨웁니다.
          </p>
        </div>
      </section>

      {/* Inquiry Form */}
      <InquiryForm />

      {/* Footer */}
      <footer className="bg-black pt-32 pb-12 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="text-3xl font-bold font-serif gold-gradient mb-8 tracking-widest uppercase">OGAPIRO</div>
              <p className="max-w-md text-gray-500 font-light leading-relaxed">
                조선행도가는 전통의 방식을 현대적인 감각으로 재해석하여, 
                누구에게나 고귀한 경험을 선사하는 프리미엄 와인을 빚습니다.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-gold">Contact</h4>
              <ul className="space-y-4 text-gray-500 font-light text-sm">
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <span>041-633-2676</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>충남 홍성군 구항면 거북로 386-35</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-gold">Online</h4>
              <ul className="space-y-4 text-gray-500 font-light text-sm">
                <li className="flex items-center space-x-3">
                  <Globe className="w-4 h-4" />
                  <a href="http://www.ogapiro.com" target="_blank" className="hover:text-white transition-colors">www.ogapiro.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            <p>© 2025 조선행도가 All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
