import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Globe, ArrowRight, Award, Clock, Heart, Sparkles, LogOut, User, CheckCircle2, ShoppingCart } from 'lucide-react';
import InquiryForm from './components/InquiryForm';
import ProductDetail from './components/ProductDetail';
import LoginModal from './components/LoginModal';
import CheckoutForm from './components/CheckoutForm';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
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
  const [isAdminActive, setIsAdminActive] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 장바구니 담기 핸들러
  const handleAddToCart = (quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === 'ogapiro_750ml');
      if (existingItem) {
        return prevItems.map(item => 
          item.id === 'ogapiro_750ml' 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: 'ogapiro_750ml',
            name: '오가피로 발효 오가피 농축액 750ml',
            price: 45000,
            quantity: quantity,
            image: '/assets/story_2.png'
          }
        ];
      }
    });
    setIsCartOpen(true); // 담은 즉시 장바구니 드로어 오픈
  };

  // 장바구니 수량 조정
  const handleUpdateCartQuantity = (id, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 장바구니 아이템 삭제
  const handleRemoveCartItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 장바구니에서 주문서로 넘어가기
  const handleCartCheckout = () => {
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmt = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCheckoutQuantity(totalQty);
    setCheckoutTotal(totalAmt);
    setIsCartOpen(false);
    setIsCheckoutActive(true);
  };

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

  // 결제 성공 핸들러
  const handlePaymentSuccess = (receiptDetails) => {
    // 실시간 주문 데이터를 로컬스토리지 DB에 연동 (어드민 연동)
    const newOrder = {
      merchant_uid: receiptDetails.merchant_uid,
      recipient: receiptDetails.recipient,
      phone: receiptDetails.phone,
      address: receiptDetails.address,
      amount: receiptDetails.amount,
      quantity: checkoutQuantity,
      method: receiptDetails.method,
      status: '배송 대기',
      created_at: new Date().toLocaleString()
    };

    const savedOrders = localStorage.getItem('ogapiro_orders');
    const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    const updatedOrdersList = [newOrder, ...ordersList];
    localStorage.setItem('ogapiro_orders', JSON.stringify(updatedOrdersList));

    setReceipt(receiptDetails);
    setIsCheckoutActive(false);
    setCartItems([]); // 결제 완료 후 장바구니 비우기
  };

  return (
    <div className="bg-obsidian text-white selection:bg-gold selection:text-black min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center glass-panel border-b border-white/5">
        <div className="text-xl sm:text-2xl font-bold font-serif tracking-widest gold-gradient">OGAPIRO <span className="text-xs sm:text-sm font-sans tracking-normal ml-1 font-medium text-gold/80">오가피로</span></div>
        <div className="hidden md:flex space-x-12 text-sm uppercase tracking-widest font-medium items-center">
          <a href="#story" className="hover:text-gold transition-colors">조선행도가 이야기</a>
          <a href="#product-detail" className="hover:text-gold transition-colors">제품 소개</a>
          <a href="#inquiry" className="hover:text-gold transition-colors">고객 문의</a>
        </div>
        
        {/* Social Profile, Cart & CTA */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Shopping Cart Header Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-300 hover:text-gold transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5.5 h-5.5" />
            {cartItems.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-gold text-black font-extrabold text-[8px] sm:text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-sans border border-black animate-pulse">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-3 sm:space-x-4 text-xs">
              <span className="flex items-center space-x-1 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-full text-gray-300 font-medium">
                <User className="w-3.5 h-3.5 text-gold" />
                <span className="font-bold text-xs hidden sm:inline">{user.user_metadata?.full_name || user.email}님</span>
              </span>
              <button 
                onClick={logout}
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">로그아웃</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs text-gray-300 hover:text-white transition-colors cursor-pointer font-bold"
            >
              로그인
            </button>
          )}
          <a href="#product-detail" className="border border-gold/30 px-4 sm:px-6 py-2 rounded-full text-xs hover:bg-gold hover:text-black transition-all font-bold">구매하기</a>
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
            조선행도가
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
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-200 font-medium leading-relaxed mb-12"
          >
            나를 아끼는 습관, 오늘은 오가피로 <br/>
            첨가물 없이 정성껏 다려낸 발효 오가피 농축액으로 온 가족의 건강을 챙겨보세요.
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1.5 }}
             className="flex flex-col xs:flex-row justify-center items-center gap-4 xs:gap-6"
          >
            <a href="#product-detail" className="w-full xs:w-auto text-center bg-gold text-black px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold/90 transition-all shadow-lg shadow-gold/5">오가피 농축액 주문하기</a>
            <a href="#story" className="group flex items-center justify-center space-x-3 text-gold text-xs uppercase tracking-widest py-2">
              <span>스토리 알아보기</span>
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
            <h2 className="text-3xl md:text-4xl font-serif leading-snug">청정 자연의 기운을 담아 <br className="hidden sm:inline" /> 오랜 시간과 정성으로 다려낸 건강한 한 방울</h2>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
              국내산 오가피만을 엄선하여 맛과 향의 깊이가 다릅니다. 오랜 기다림과 조선행도가의 정성스러운 손길로 자연 본연의 영양 성분을 고스란히 농축했습니다.
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
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
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
      <section className="bg-emerald-dark/10 py-24 md:py-32 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 md:space-y-12">
          <Heart className="mx-auto text-gold w-10 h-10 md:w-12 md:h-12" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic leading-snug">"나와 가족을 위한 건강한 습관, 오가피로"</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium leading-relaxed">
            건강한 몸과 편안한 하루를 위한 선택. <br/>
            첨가물 없이 정성을 다해 다려낸 오가피의 기운이 온 가족의 일상을 활기차게 깨웁니다.
          </p>
        </div>
      </section>

      {/* Products Preview Section - 제품 라인업 */}
      <section className="py-16 md:py-20 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold text-xs uppercase tracking-widest mb-2 font-semibold">오가피로 시리즈</p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">나를 아끼는 습관, 오늘은 오가피로</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {/* 750ml - 메인 */}
            <a href="#product-detail" className="group text-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-3 group-hover:border-gold/30 transition-all">
                <img src="/assets/story_2.png" alt="오가피로 750ml" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-white font-bold text-sm">오가피로 750ml</p>
              <p className="text-gold font-serif font-bold text-sm">45,000원</p>
              <span className="text-[10px] text-gold/60 bg-gold/10 px-2 py-0.5 rounded-full mt-1 inline-block">판매 중</span>
            </a>
            {/* 375ml */}
            <a href="#product-detail" className="group text-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 mb-3 group-hover:border-gold/30 transition-all">
                <img src="/assets/story_1.png" alt="오가피로 375ml" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-white font-bold text-sm">오가피로 375ml</p>
              <p className="text-gold font-serif font-bold text-sm">22,000원</p>
              <span className="text-[10px] text-gold/60 bg-gold/10 px-2 py-0.5 rounded-full mt-1 inline-block">판매 중</span>
            </a>
            {/* 500ml - 예정 */}
            <div className="group text-center opacity-60">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/3 border border-white/5 mb-3 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">🌿</div>
                  <p className="text-xs text-gray-500">준비 중</p>
                </div>
              </div>
              <p className="text-gray-400 font-bold text-sm">오가피로 500ml</p>
              <p className="text-gray-500 font-serif text-sm">35,000원</p>
              <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full mt-1 inline-block">출시 예정</span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Premium Product Detail View */}
      <ProductDetail 
        onPurchase={handlePurchaseInit} 
        onAddToCart={handleAddToCart}
      />

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
                cartItems={cartItems}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Immersive Admin Panel overlays */}
      <AnimatePresence>
        {isAdminActive && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-start justify-center p-4 py-8 sm:py-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-5xl my-auto"
            >
              <AdminPanel onClose={() => setIsAdminActive(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Immersive Shopping Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCartCheckout}
      />

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
                <span className="inline-block bg-gold/10 text-gold px-3.5 py-1.5 rounded-full text-xs font-bold">
                  주문 완료
                </span>
                <h3 className="text-2xl font-serif font-bold leading-tight">주문이 정상적으로 <br/>접수되었습니다</h3>
                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                  정성 가득 담은 오가피 농축액을 신속하고 안전하게 배송해 드리겠습니다.
                </p>
              </div>

              {/* Receipt Body */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/2 border border-white/10 text-left text-xs space-y-2.5 font-medium text-gray-200">
                <div className="flex justify-between">
                  <span>주문 번호:</span>
                  <span className="text-white font-mono">{receipt.merchant_uid}</span>
                </div>
                <div className="flex justify-between">
                  <span>수령인:</span>
                  <span className="text-white font-bold">{receipt.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span>연락처:</span>
                  <span className="text-white font-bold">{receipt.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>배송 주소:</span>
                  <span className="text-white font-bold text-right max-w-[200px] truncate">{receipt.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>결제 수단:</span>
                  <span className="text-gold font-bold">{receipt.method === 'kakaopay' ? '카카오페이' : '토스페이'} 간편결제</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-black text-sm">
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
      <footer className="bg-black pt-16 pb-10 px-6 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 브랜드 */}
            <div className="col-span-1">
              <div className="text-xl sm:text-2xl font-bold font-serif gold-gradient mb-4 tracking-widest uppercase">OGAPIRO <span className="text-xs font-sans tracking-normal ml-1 font-medium text-gold/80">오가피로</span></div>
              <p className="text-gray-300 font-medium text-xs leading-relaxed mb-4">
                조선행도가는 전통 방식을 지키며, 가족의 건강을 위해 정성을 다해 오가피를 다립니다.
              </p>
              {/* SNS */}
              <div className="flex space-x-3">
                <a href="https://instagram.com/ogapi.ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors text-xs">인스타그램</a>
                <a href="https://www.youtube.com/@오가피로" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors text-xs">유튜브</a>
                <a href="https://blog.naver.com/ogapiro_ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors text-xs">블로그</a>
                <a href="https://pf.kakao.com/_btxbxhX" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors text-xs">카카오</a>
              </div>
            </div>

            {/* 고객 안내 */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-widest mb-4 text-gold">고객 안내</h4>
              <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0 text-gold" />
                  <span className="font-bold">041-633-2676</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gold" />
                  <span>충남 홍성군 구항면 거북로 386-35</span>
                </li>
                <li className="text-gray-400 pl-6">평일/주말 09:00~18:00 (일요일 휴무)</li>
                <li className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 flex-shrink-0 text-gold" />
                  <a href="http://www.ogapiro.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.ogapiro.com</a>
                </li>
                <li className="text-gray-400 pl-6">이메일: kellyou@empas.com</li>
              </ul>
            </div>

            {/* 무통장 / 사업자 */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold tracking-widest mb-4 text-gold">무통장 입금</h4>
              <div className="p-3.5 rounded-xl bg-white/3 border border-white/10 text-xs space-y-1.5 text-gray-300">
                <p className="font-bold text-white">농협회원조합</p>
                <p className="font-mono">351-1364-2054-03</p>
                <p className="text-gray-400">예금주: 농업회사법인 조선행도가 주식회사</p>
              </div>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div className="border-t border-white/10 pt-6 text-[10px] text-gray-500 space-y-1 leading-relaxed">
            <p>상호명: 농업회사법인 조선행도가 주식회사 | 대표자명: 유은경 | 사업자 등록번호: 390-88-03534</p>
            <p>사업장 주소: 32215 충청남도 홍성군 구항면 거북로 386-35 1층</p>
            <p>통신판매업 신고번호: 제 2026-충남홍성-0052호 | 지역특산주(과실주) 통신판매업 신고번호: 제 2026-충남아산-0096호</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-5 border-t border-white/5 mt-5 text-[10px] text-gray-500 gap-3">
            <p>© 2026 조선행도가 All rights reserved.</p>
            <div className="space-x-4 sm:space-x-6">
              <span onClick={() => setIsAdminActive(true)} className="cursor-pointer hover:text-gold transition-colors text-gold/50 font-semibold">[어드민 주문관리]</span>
              <span className="cursor-pointer hover:text-white transition-colors">개인정보 처리방침</span>
              <span className="cursor-pointer hover:text-white transition-colors">이용약관</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
