import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, FileText, ChevronDown, ChevronUp, Star, ShoppingBag } from 'lucide-react';

export default function ProductDetail({ onPurchase }) {
  const [quantity, setQuantity] = useState(1);
  const [showLegalInfo, setShowLegalInfo] = useState(false);

  const pricePerUnit = 120000; // 120,000 KRW
  const totalAmount = pricePerUnit * quantity;

  return (
    <section id="product-detail" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 bg-obsidian">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left: Product Images & Quality Badges */}
        <div className="space-y-6 w-full max-w-lg mx-auto md:max-w-none">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
            <img 
              src="/assets/story_2.png" 
              alt="오가피로 프리미엄 농축액" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Premium Badge */}
            <span className="absolute top-4 left-4 md:top-6 md:left-6 z-20 bg-gold/90 text-black px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-widest rounded-full uppercase">
              PREMIUM EDITION
            </span>
          </motion.div>

          {/* Key Trust Badges */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-200 leading-tight">무첨가물 원칙</p>
              <p className="text-[8px] sm:text-[9px] text-gray-500">100% 천연 오가피</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-200 leading-tight">전통 천연발효</p>
              <p className="text-[8px] sm:text-[9px] text-gray-500">365일 저온 숙성</p>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-gold mx-auto" />
              <p className="text-[10px] sm:text-[11px] font-semibold text-gray-200 leading-tight">식약처 규정 준수</p>
              <p className="text-[8px] sm:text-[9px] text-gray-500">정밀 품질검증 필</p>
            </div>
          </div>
        </div>

        {/* Right: Purchase Box */}
        <div className="space-y-6 md:space-y-8 w-full max-w-lg mx-auto md:max-w-none">
          {/* Headline & Rating */}
          <div className="space-y-3">
            <div className="flex items-center space-x-1 text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
              <span className="text-[11px] text-gray-400 font-light ml-2">(4.9/5.0 프리미엄 리뷰)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight leading-snug">
              오가피로 프리미엄 고농축액 <br/>
              <span className="gold-gradient">Obsidian 365 에디션</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
              조선행도가의 철저한 위생 관리와 자연 저온 숙성을 거쳐 단 1%의 화학 보존료나 인공 감미료 없이 빚어낸 순수한 명품 오가피 농축액입니다. 카페 콜라보 및 홈 메이드 에너지 드링크 베이스로 최적화되었습니다.
            </p>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-white/5 flex items-baseline justify-between">
            <span className="text-xs sm:text-sm text-gray-400 font-light">판매 가격</span>
            <div className="space-y-1 text-right">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-white">{pricePerUnit.toLocaleString()}</span>
              <span className="text-sm sm:text-lg text-gray-400 font-light ml-1">원</span>
              <p className="text-[9px] sm:text-[10px] text-gold font-medium">※ 카페 제휴 및 단체 주문 시 별도 할인 혜택 제공</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-400 font-light">주문 수량 선택</span>
            <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 active:scale-95 transition-all text-lg cursor-pointer"
              >
                -
              </button>
              <span className="w-10 sm:w-12 text-center text-xs sm:text-sm font-bold font-serif">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 active:scale-95 transition-all text-lg cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gold">최종 주문 금액</span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-serif text-gold">{totalAmount.toLocaleString()}</span>
              <span className="text-xs sm:text-sm text-gold font-light ml-1">원</span>
            </div>
          </div>

          {/* Main Purchase CTA */}
          <button 
            onClick={() => onPurchase(quantity, totalAmount)}
            className="w-full h-14 sm:h-16 bg-gold text-black font-bold text-sm sm:text-base rounded-2xl hover:bg-gold/90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-gold/10 flex items-center justify-center space-x-3 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span>즉시 간편결제로 주문하기</span>
          </button>

          {/* Korean Food Labeling Compliance Accordion */}
          <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/2">
            <button 
              onClick={() => setShowLegalInfo(!showLegalInfo)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-[11px] sm:text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>식품위생법에 따른 의무 표시사항 (제품 법적 명세)</span>
              {showLegalInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showLegalInfo && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 text-[10px] text-gray-500 leading-relaxed border-t border-white/5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <span className="text-gray-400 font-medium">제품명:</span> 오가피로 Obsidian 365
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">식품유형:</span> 액상차 (일반 식품)
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">제조사:</span> 조선행도가
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">소재지:</span> 충남 홍성군 구항면 거북로 386-35
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 font-medium">원재료명 및 함량:</span> 국내산 오가피 열매 추출액 100%
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">유통기한:</span> 포장지 하단 별도 표기일까지
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">포장재질:</span> 유리(용기), LDPE(캡)
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 font-medium">보관방법:</span> 직사광선을 피하고 실온보관 (개봉 후 냉장보관 권장)
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3 text-[9px] leading-relaxed">
                  🚨 **소비자 주의사항**: 본 제품은 천연 원료만을 사용하여 침전물이 생길 수 있으나 흔들어 드시면 안심하고 섭취하실 수 있습니다. 본 제품은 질병의 예방 및 치료를 위한 의약품이 아닌 일반 식품(액상차)입니다.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
