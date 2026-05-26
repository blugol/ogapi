import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Coffee, GlassWater } from 'lucide-react';

export default function RecipeSection() {
  const recipes = [
    {
      icon: <GlassWater className="w-8 h-8 text-blue-400" />,
      title: "오가피 에이드 (스파클링)",
      desc: "얼음 가득한 잔에 탄산수 200ml와 오가피로 30ml를 넣어 시원하고 청량하게 즐기세요. 톡 쏘는 탄산과 오가피의 향이 어우러집니다.",
      tag: "시원하게"
    },
    {
      icon: <Droplets className="w-8 h-8 text-teal-400" />,
      title: "아이스 오가피차",
      desc: "차가운 생수 200ml에 오가피로 30ml를 타서 깔끔하게 갈증을 해소하세요. 운동 후나 더운 여름철 수분 섭취에 좋습니다.",
      tag: "깔끔하게"
    },
    {
      icon: <Coffee className="w-8 h-8 text-amber-500" />,
      title: "따뜻한 오가피차",
      desc: "자기 전 따뜻한 물 200ml에 오가피로 30ml를 넣어 하루의 피로를 부드럽게 풀어주세요. 온 몸이 따뜻해지는 기분을 느낄 수 있습니다.",
      tag: "따뜻하게"
    }
  ];

  return (
    <section id="recipe" className="py-12 md:py-20 px-4 sm:px-6 bg-obsidian border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-gold text-[10px] md:text-xs uppercase tracking-widest mb-2 font-semibold">How to Enjoy</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-3 md:mb-4">오가피로를 즐기는 3가지 방법</h2>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">오가피로 고농축액은 기호에 따라 다양하게 희석하여 즐기실 수 있습니다.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-gold/30 transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                {recipe.icon}
              </div>
              <span className="text-[10px] text-gold font-bold px-2.5 py-1 rounded-full border border-gold/30 bg-gold/5 mb-3">
                {recipe.tag}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{recipe.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {recipe.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center p-6 bg-white/5 rounded-2xl border border-white/10 max-w-3xl mx-auto">
          <p className="text-xs md:text-sm text-gray-300 font-medium">
            💡 <strong className="text-gold">추천 비율:</strong> 물 200ml 기준 <strong className="text-white">오가피로 30ml</strong> (소주잔 약 1잔) <br/>
            기호에 따라 농축액의 양을 조절하여 진하게 혹은 연하게 드시면 더욱 좋습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
