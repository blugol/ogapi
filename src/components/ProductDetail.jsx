import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, FileText, ChevronDown, ChevronUp, ShoppingBag, ShoppingCart } from 'lucide-react';

export default function ProductDetail({ onPurchase, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showLegalInfo, setShowLegalInfo] = useState(false);

  // 실제 사이트 기준 가격 반영 (오가피로 프리미엄 에디션: 45,000원)
  const pricePerUnit = 45000; 
  const totalAmount = pricePerUnit * quantity;

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(quantity);
    }
  };

  return (
    <section id="product-detail" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 bg-obsidian">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left: Product Images & Quality Badges */}
        <div className="space-y-6 w-full max-w-lg mx-auto md:max-w-none">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
            <img 
              src="/assets/story_2.png" 
              alt="오가피로 프리미엄 발효 농축액" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Premium Badge */}
            <span className="absolute top-4 left-4 md:top-6 md:left-6 z-20 bg-gold text-black px-4 py-2 text-xs font-bold tracking-wider rounded-full">
              프리미엄 발효 농축액
            </span>
          </motion.div>

          {/* Key Trust Badges */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <ShieldCheck className="w-6 h-6 text-gold mx-auto" />
              <p className="text-xs font-bold text-white leading-tight">최상급 원료</p>
              <p className="text-[10px] text-gray-300 font-medium">100% 국내산 오가피</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <Calendar className="w-6 h-6 text-gold mx-auto" />
              <p className="text-xs font-bold text-white leading-tight">장인의 손길</p>
              <p className="text-[10px] text-gray-300 font-medium">전통 천연발효 숙성</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <FileText className="w-6 h-6 text-gold mx-auto" />
              <p className="text-xs font-bold text-white leading-tight">깊고 부드러운 향</p>
              <p className="text-[10px] text-gray-300 font-medium">인공 감미료 무첨가</p>
            </div>
          </div>
        </div>

        {/* Right: Purchase Box */}
        <div className="space-y-6 md:space-y-8 w-full max-w-lg mx-auto md:max-w-none">
          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-snug">
              오가피로 프리미엄 고농축액 <br/>
              <span className="gold-gradient">750ml 에디션</span>
            </h2>
            <p className="text-sm text-gray-200 font-normal leading-relaxed">
              청정 자연의 기운을 머금고 자란 국내산 최상급 오가피만을 엄선하여, 조선행도가 장인의 헌신적인 전통 발효 비법으로 완성해 낸 명품 농축액입니다. 오가피 본연의 풍미와 은은한 단맛, 부드러운 목 넘김을 온전히 보존했습니다. 물이나 탄산수, 우유에 희석하여 건강 음료 및 프리미엄 카페 드링크 베이스로 즐기기에 완벽합니다.
            </p>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-white/10 flex items-baseline justify-between">
            <span className="text-xs sm:text-sm text-gray-300 font-medium">판매 가격</span>
            <div className="space-y-1 text-right">
              <span className="text-3xl sm:text-4xl font-extrabold font-serif text-white">{pricePerUnit.toLocaleString()}</span>
              <span className="text-sm sm:text-lg text-white font-medium ml-1">원</span>
              <p className="text-[10px] sm:text-xs text-gold font-semibold">※ 주는 이의 품격과 받는 이의 감동을 모두 담은 프리미엄 패키지 포함</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-300 font-medium">주문 수량 선택</span>
            <div className="flex items-center space-x-1 bg-white/5 p-1.5 rounded-xl border border-white/10">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white active:scale-95 transition-all text-xl cursor-pointer font-bold"
              >
                -
              </button>
              <span className="w-10 sm:w-12 text-center text-sm font-extrabold font-serif text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-white active:scale-95 transition-all text-xl cursor-pointer font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Calculation */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gold/5 border border-gold/20 flex items-center justify-between shadow-inner">
            <span className="text-sm font-bold text-gold">최종 주문 금액</span>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black font-serif text-gold">{totalAmount.toLocaleString()}</span>
              <span className="text-xs sm:text-sm text-gold font-bold ml-1">원</span>
            </div>
          </div>

          {/* Checkout & Cart Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleAddToCartClick}
              className="flex-1 h-14 sm:h-16 bg-white/5 hover:bg-white/10 border border-gold/30 hover:border-gold text-gold font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>장바구니 담기</span>
            </button>
            <button 
              onClick={() => onPurchase(quantity, totalAmount)}
              className="flex-2 h-14 sm:h-16 bg-gold text-black font-bold text-sm sm:text-base rounded-2xl hover:bg-gold/90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-gold/10 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>즉시 간편결제로 주문하기</span>
            </button>
          </div>

          {/* Korean Food Labeling Compliance Accordion */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/2">
            <button 
              onClick={() => setShowLegalInfo(!showLegalInfo)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs font-bold text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              <span>식품위생법에 따른 의무 표시사항 (제품 법적 명세)</span>
              {showLegalInfo ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
            </button>
            
            {showLegalInfo && (
              <div className="px-4 sm:px-5 pb-5 space-y-3.5 text-xs text-gray-200 leading-relaxed border-t border-white/10 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                  <div>
                    <span className="text-gray-400 font-bold">제품명:</span> 오가피로 750ml (농축액 에디션)
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">식품유형:</span> 액상차 (일반 식품)
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">제조사:</span> 조선행도가
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">소재지:</span> 충남 홍성군 구항면 거북로 386-35
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 font-bold">원재료명 및 함량:</span> 국내산 오가피 열매 추출액 100%
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">유통기한:</span> 포장지 하단 별도 표기일까지
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">포장재질:</span> 유리(용기), LDPE(캡)
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 font-bold">보관방법:</span> 직사광선을 피하고 실온보관 (개봉 후 냉장보관 권장)
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 text-[10px] sm:text-xs text-gray-300 leading-relaxed font-light">
                  🚨 **소비자 주의사항**: 본 제품은 천연 원료만을 사용하여 침전물이 생길 수 있으나 흔들어 드시면 안심하고 섭취하실 수 있습니다. 본 제품은 주류가 아니며, 질병의 예방 및 치료를 위한 의약품이 아닌 일반 식품(액상차)입니다.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
