import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Globe, ArrowRight, Award, Clock, Heart, Sparkles, LogOut, User, CheckCircle2 } from 'lucide-react';
import InquiryForm from './components/InquiryForm';
import ProductDetail from './components/ProductDetail';
import LoginModal from './components/LoginModal';
import CheckoutForm from './components/CheckoutForm';
import { useAuth } from './hooks/useAuth';

function App() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Auth & Checkout State
  const { user, isLoggedIn, isDemoMode, loginWithKakao, loginWithGoogle, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [receipt, setReceipt] = useState(null);

  // 구매 진행 핸들러 (로그인 장벽을 완전히 걷어내고 즉시 결제 주문서로 진입!)
  const handlePurchaseInit = (quantity, totalAmount) => {
    setCheckoutQuantity(quantity);
    setCheckoutTotal(totalAmount);
    setIsCheckoutActive(true);
  };

  // 로그인 성공 후 후속 처리 (구매 연동)
  const handleSocialLogin = async (type) => {
    try {
      if (type === 'kakao') {
        await loginWithKakao();
      } else {
        await loginWithGoogle();
      }
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error('로그인 에러:', err);
    }
  };

  const handlePaymentSuccess = (receiptDetails) => {
    setReceipt(receiptDetails);
    setIsCheckoutActive(false);
  };

  return (
    <div className="bg-obsidian text-white selection:bg-gold selection:text-black min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center glass-panel border-b border-white/5">
        <div className="text-xl sm:text-2xl font-bold font-serif tracking-widest gold-gradient">OGAPIRO</div>
        <div className="hidden md:flex space-x-12 text-sm uppercase tracking-widest font-medium items-center">
          <a href="#story" className="hover:text-gold transition-colors">Story</a>
          <a href="#product-detail" className="hover:text-gold transition-colors">Product</a>
          <a href="#inquiry" className="hover:text-gold transition-colors">Contact</a>
        </div>
        
        {/* Social Profile & CTA */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3 sm:space-x-4 text-xs">
              <span className="flex items-center space-x-1 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-full text-gray-300">
                <User className="w-3.5 h-3.5 text-gold" />
                <span className="font-semibold text-[10px] hidden sm:inline">{user.user_metadata?.full_name || user.email}님</span>
              </span>
              <button 
                onClick={logout}
                className="text-gray-500 hover:text-white transition-colors flex items-center space-x-1 uppercase tracking-widest text-[9px] font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              LOGIN
            </button>
          )}
          <a href="#product-detail" className="border border-gold/30 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs hover:bg-gold hover:text-black transition-all uppercase tracking-widest font-semibold">BUY NOW</a>
        </div>
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
            className="text-gold uppercase text-sm mb-6 font-semibold"
          >
            Chosun Hangdo-ga
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl sm:text-6xl md:text-8xl font-serif font-black mb-8 leading-tight"
          >
            조선행도가 <br/> <span className="gold-gradient">오가피로</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-12"
          >
            자연이 빚고 시간이 채우다 <br/>
            첨가물 없이 빚어낸 프리미엄 오가피 발효 농축액의 깊은 숨결을 경험하십시오.
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1.5 }}
             className="flex flex-col xs:flex-row justify-center items-center gap-4 xs:gap-6"
          >
            <a href="#product-detail" className="w-full xs:w-auto text-center bg-gold text-black px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold/90 transition-all shadow-lg shadow-gold/5">Order Premium Bottle</a>
            <a href="#story" className="group flex items-center justify-center space-x-3 text-gold text-xs uppercase tracking-widest py-2">
              <span>Explore the Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>
      </header>

      {/* Story Section */}
      <section id="story" className="py-24 md:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden premium-border w-full max-w-md mx-auto md:max-w-none shadow-2xl"
          >
            <img src="/assets/story_1.png" alt="Raw Materials" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="text-gold text-3xl md:text-4xl font-serif mb-1 block">01</span>
              <h3 className="text-2xl md:text-3xl font-bold">전통과 현대의 만남</h3>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-8 w-full max-w-md mx-auto md:max-w-none"
          >
            <Award className="text-gold w-10 h-10 md:w-12 md:h-12" />
            <h2 className="text-3xl md:text-4xl font-serif leading-snug">청정 자연의 기운을 담아 <br className="hidden sm:inline" /> 장인의 손길로 빚어낸 고귀한 한 방울</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed font-light">
              비옥한 토양과 맑은 공기를 머금고 자란 국내산 최상급 오가피만을 사용하여 맛과 향의 깊이가 다릅니다. 오랜 기다림과 조선행도가 장인의 섬세한 손길로 자연 본연의 영양 성분과 풍미를 고스란히 농축했습니다.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, order: 2 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-8 w-full max-w-md mx-auto md:max-w-none md:order-1"
          >
            <Clock className="text-gold w-10 h-10 md:w-12 md:h-12" />
            <h2 className="text-3xl md:text-4xl font-serif leading-snug">기다림의 미학, <br className="hidden sm:inline" /> 자연 발효와 저온 숙성</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed font-light">
              천천히 숙성되는 전통 발효 과정을 통해 인위적인 가공 없이도 깊고 부드러운 맛을 완성합니다. 오가피 본연의 깊은 향과 은은한 단맛, 부드러운 목 넘김이 조화롭게 어우러져 깊은 여운을 남깁니다.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden premium-border w-full max-w-md mx-auto md:max-w-none md:order-2 shadow-2xl"
          >
            <img src="/assets/story_2.png" alt="Premium Gift Set" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="text-gold text-3xl md:text-4xl font-serif mb-1 block">02</span>
              <h3 className="text-2xl md:text-3xl font-bold">시간이 완성한 이야기</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-emerald-dark/10 py-24 md:py-32 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 md:space-y-12">
          <Heart className="mx-auto text-gold w-10 h-10 md:w-12 md:h-12" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic leading-snug">"나를 아끼는 기품 있는 습관, 오가피로"</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            건강한 몸과 여유로운 마음을 위한 선택. <br/>
            첨가물 없이 오랜 기다림으로 빚어낸 순수한 오가피의 힘이 당신의 귀한 하루를 정성스레 깨웁니다.
          </p>
        </div>
      </section>

      {/* Embedded Premium Product Detail View */}
      <ProductDetail onPurchase={handlePurchaseInit} />

      {/* Immersive Checkout overlays */}
      <AnimatePresence>
        {isCheckoutActive && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-start justify-center p-4 py-8 sm:py-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl my-auto"
            >
              <CheckoutForm 
                user={user}
                totalAmount={checkoutTotal}
                quantity={checkoutQuantity}
                onBack={() => setIsCheckoutActive(false)}
                onPaymentSuccess={handlePaymentSuccess}
                onKakaoLogin={() => setIsLoginModalOpen(true)}
                onLogout={logout}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginKakao={() => handleSocialLogin('kakao')}
        onLoginGoogle={() => handleSocialLogin('google')}
        isDemoMode={isDemoMode}
      />

      {/* Payment Success Receipt Dialog */}
      <AnimatePresence>
        {receipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReceipt(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#131313] p-6 sm:p-8 border border-gold/20 shadow-2xl text-center space-y-5 sm:space-y-6 mx-auto"
            >
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-gold mx-auto" />
              <div className="space-y-2">
                <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-[9px] tracking-widest font-semibold uppercase">
                  Order Completed
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold leading-tight">귀하의 고귀한 주문이 <br/>완벽히 접수되었습니다</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 font-light leading-relaxed">
                  전통을 품은 정성 가득한 오가피 농축액을 귀하의 소중한 처소로 신속하고 안전하게 전달해 드리겠습니다.
                </p>
              </div>

              {/* Receipt Body */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/2 border border-white/5 text-left text-[11px] sm:text-xs space-y-2 font-light text-gray-400">
                <div className="flex justify-between">
                  <span>주문 번호:</span>
                  <span className="text-white font-mono">{receipt.merchant_uid}</span>
                </div>
                <div className="flex justify-between">
                  <span>수령인:</span>
                  <span className="text-white font-medium">{receipt.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span>연락처:</span>
                  <span className="text-white font-medium">{receipt.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>배송 주소:</span>
                  <span className="text-white font-medium text-right max-w-[200px] truncate">{receipt.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>결제 수단:</span>
                  <span className="text-gold font-medium uppercase">{receipt.method} 간편결제</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between font-bold text-xs sm:text-sm">
                  <span className="text-gold">최종 결제액:</span>
                  <span className="text-gold font-serif">{receipt.amount.toLocaleString()}원</span>
                </div>
              </div>

              <button
                onClick={() => setReceipt(null)}
                className="w-full h-11 sm:h-12 bg-gold text-black font-bold text-xs rounded-xl hover:bg-gold/90 transition-all cursor-pointer"
              >
                영수증 확인 및 돌아가기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Form */}
      <InquiryForm />

      {/* Footer */}
      <footer className="bg-black pt-24 pb-12 px-6 sm:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-20">
            <div className="col-span-2">
              <div className="text-2xl sm:text-3xl font-bold font-serif gold-gradient mb-6 md:mb-8 tracking-widest uppercase">OGAPIRO</div>
              <p className="max-w-md text-gray-500 font-light text-xs sm:text-sm leading-relaxed">
                조선행도가는 전통의 방식을 현대적인 감각으로 재해석하여, 
                누구에게나 고귀한 경험을 선사하는 프리미엄 농축액을 빚습니다.
              </p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8 text-gold">Contact</h4>
              <ul className="space-y-3 sm:space-y-4 text-gray-500 font-light text-xs sm:text-sm">
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>041-633-2676</span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>충남 홍성군 구항면 거북로 386-35</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 md:mb-8 text-gold">Online</h4>
              <ul className="space-y-3 sm:space-y-4 text-gray-500 font-light text-xs sm:text-sm">
                <li className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <a href="http://www.ogapiro.com" target="_blank" className="hover:text-white transition-colors">www.ogapiro.com</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 md:pt-12 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-[0.2em] gap-4">
            <p>© 2026 조선행도가 All rights reserved.</p>
            <div className="space-x-6 sm:space-x-8">
              <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
