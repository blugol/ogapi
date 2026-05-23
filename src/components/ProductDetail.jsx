import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, FileText, ChevronDown, ChevronUp, ShoppingBag, ShoppingCart } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'ogapiro_750ml',
    name: '오가피로 750ml',
    label: '750ml',
    price: 45000,
    image: '/assets/story_2.png',
    badge: '베스트셀러',
    desc: '맑은 공기와 건강한 흙에서 자란 국내산 오가피만을 엄선하여, 조선행도가의 전통 옹기 발효 비법으로 오랜 시간 다려낸 건강 농축액입니다. 오가피 본연의 깊은 풍미와 자연스러운 단맛을 담아 남녀노소 누구나 즐기실 수 있습니다.'
  },
  {
    id: 'ogapiro_375ml',
    name: '오가피로 375ml',
    label: '375ml',
    price: 22000,
    image: '/assets/story_1.png',
    badge: '소용량 · 선물용',
    desc: '처음 오가피를 경험하시거나 선물로 드리기에 좋은 소용량 패키지입니다. 동일한 품질의 발효 오가피 농축액을 합리적인 가격으로 부담 없이 만나보세요.'
  }
];

export default function ProductDetail({ onPurchase, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [showLegalInfo, setShowLegalInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);

  const totalAmount = selectedProduct.price * quantity;

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(quantity, selectedProduct.id, selectedProduct.name, selectedProduct.price);
    }
  };

  return (
    <section id="product-detail" className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 bg-obsidian">
      {/* 제품 선택 탭 */}
      <div className="flex gap-2 mb-8 max-w-xs">
        {PRODUCTS.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedProduct(p); setQuantity(1); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
              selectedProduct.id === p.id
                ? 'bg-gold text-black border-gold'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-gold/30'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left: Product Images & Quality Badges */}
        <div className="space-y-6 w-full max-w-lg mx-auto md:max-w-none">
          <motion.div 
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <span className="absolute top-4 left-4 md:top-6 md:left-6 z-20 bg-gold text-black px-4 py-2 text-xs font-bold tracking-wider rounded-full">
              {selectedProduct.badge}
            </span>
          </motion.div>

          {/* Key Trust Badges */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <ShieldCheck className="w-6 h-6 text-gold mx-auto" />
              <p className="text-xs font-bold text-white leading-tight">정직한 원료</p>
              <p className="text-[10px] text-gray-300 font-medium">국내산 오가피 100%</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <Calendar className="w-6 h-6 text-gold mx-auto" />
              <p className="text-xs font-bold text-white leading-tight">정성 어린 숙성</p>
              <p className="text-[10px] text-gray-300 font-medium">전통 옹기 발효 숙성</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col justify-center space-y-1.5 hover:bg-white/5 transition-all">
              <FileText className="w-6 h-6 text-gold mx-auto" />
              <p className="text-xs font-bold text-white leading-tight">순수한 자연의 맛</p>
              <p className="text-[10px] text-gray-300 font-medium">보존료, 감미료 무첨가</p>
            </div>
          </div>
        </div>

        {/* Right: Purchase Box */}
        <div className="space-y-6 md:space-y-8 w-full max-w-lg mx-auto md:max-w-none">
          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight leading-snug">
              오가피로 발효 고농축액 <br/>
              <span className="gold-gradient">{selectedProduct.label}</span>
            </h2>
            <p className="text-sm text-gray-200 font-normal leading-relaxed">
              {selectedProduct.desc}
            </p>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-white/10 flex items-baseline justify-between">
            <span className="text-xs sm:text-sm text-gray-300 font-medium">판매 가격</span>
            <div className="space-y-1 text-right">
              <span className="text-3xl sm:text-4xl font-extrabold font-serif text-white">{selectedProduct.price.toLocaleString()}</span>
              <span className="text-sm sm:text-lg text-white font-medium ml-1">원</span>
              <p className="text-[10px] sm:text-xs text-gold font-semibold">무료배송 · 정성을 담아 안전 포장</p>
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
              onClick={() => onPurchase(quantity, totalAmount, selectedProduct.id, selectedProduct.name, selectedProduct.price)}
              className="flex-2 h-14 sm:h-16 bg-gold text-black font-bold text-sm sm:text-base rounded-2xl hover:bg-gold/90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-gold/10 flex items-center justify-center space-x-3 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>주문하기</span>
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
                    <span className="text-gray-400 font-bold">제품명:</span> 오가피로 750ml (고농축액)
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
