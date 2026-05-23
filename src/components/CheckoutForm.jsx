import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, MapPin, Sparkles, MessageCircle } from 'lucide-react';

export default function CheckoutForm({ user, totalAmount, quantity, onBack, onPaymentSuccess, onKakaoLogin, onLogout, cartItems = [] }) {
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [formData, setFormData] = useState({
    recipient: '',
    phone: '',
    zipcode: '',
    baseAddress: '',
    detailAddress: '',
    paymentMethod: 'kakaopay' // kakaopay or tosspay
  });

  const [loading, setLoading] = useState(false);


  // 로드된 소셜 배송지 리스트
  const deliveryAddresses = user?.user_metadata?.delivery_addresses || [];

  // 카카오 배송지 선택 시 자동 완성
  useEffect(() => {
    if (selectedAddressId) {
      const selected = deliveryAddresses.find(addr => addr.id === selectedAddressId);
      if (selected) {
        setFormData(prev => ({
          ...prev,
          recipient: selected.recipient || '',
          phone: selected.phone || '',
          zipcode: selected.zipcode || '',
          baseAddress: selected.baseAddress || '',
          detailAddress: selected.detailAddress || ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        recipient: user?.user_metadata?.full_name || '',
        phone: user?.user_metadata?.phone || '',
        zipcode: '',
        baseAddress: '',
        detailAddress: ''
      }));
    }
  }, [selectedAddressId, user, deliveryAddresses]);

  // 포트원 결제 SDK 스크립트 동적 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!formData.recipient || !formData.phone || !formData.baseAddress) {
      alert('배송지 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    if (!window.IMP) {
      // SDK 로드 실패 시 가상 결제 데모 작동
      console.warn('Portone SDK not loaded, running fallback simulation.');
      setTimeout(() => {
        setLoading(false);
        onPaymentSuccess({
          merchant_uid: `mid_demo_${Date.now()}`,
          amount: totalAmount,
          recipient: formData.recipient,
          phone: formData.phone,
          address: `${formData.baseAddress} ${formData.detailAddress}`,
          method: formData.paymentMethod
        });
      }, 1500);
      return;
    }

    const IMP = window.IMP;
    // 포트원 고객사 식별코드 적용
    IMP.init('imp86612685'); 

    // PG사 구분자 설정
    const pgProvider = formData.paymentMethod === 'kakaopay' 
      ? 'kakaopay.TC00000000' // 카카오페이 테스트 코드
      : 'tosspay.tosstest';   // 토스페이 테스트 코드

    IMP.request_pay({
      pg: pgProvider,
      pay_method: 'card',
      merchant_uid: `mid_${Date.now()}`,
      name: '오가피로 프리미엄 고농축액 Obsidian',
      amount: totalAmount,
      buyer_email: user?.email || 'buyer@example.com',
      buyer_name: formData.recipient,
      buyer_tel: formData.phone,
      buyer_addr: `${formData.baseAddress} ${formData.detailAddress}`,
      buyer_postcode: formData.zipcode
    }, function (rsp) {
      setLoading(false);
      if (rsp.success) {
        onPaymentSuccess({
          imp_uid: rsp.imp_uid,
          merchant_uid: rsp.merchant_uid,
          amount: rsp.paid_amount,
          recipient: formData.recipient,
          phone: formData.phone,
          address: `${formData.baseAddress} ${formData.detailAddress}`,
          method: formData.paymentMethod
        });
      } else {
        alert(`결제에 실패하였습니다: ${rsp.error_msg}`);
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-5 sm:p-8 md:p-10 rounded-3xl bg-[#131313] border border-white/5 shadow-2xl">
      {/* Back Header */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-sm text-gray-200 hover:text-white mb-6 md:mb-8 transition-colors cursor-pointer font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-gold" />
        <span>상품 정보로 돌아가기</span>
      </button>

      <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-5 text-white">주문서 작성 및 결제</h3>

      {/* Order Brief */}
      <div className="p-5 rounded-2xl bg-white/2 border border-white/10 mb-6 space-y-3.5">
        <div className="text-xs text-gray-300 font-bold uppercase tracking-wider border-b border-white/5 pb-2">주문 품목 요약</div>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-xs font-semibold text-white">
              <span>{item.name}</span>
              <span className="text-gold font-serif">{item.quantity}병 / {(item.price * item.quantity).toLocaleString()}원</span>
            </div>
          ))
        ) : (
          <div className="flex justify-between text-xs font-semibold text-white">
            <span>오가피로 750ml</span>
            <span className="text-gold font-serif">{quantity}병 / {totalAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-gray-300 font-medium">
          <span>배송 방식</span>
          <span className="font-bold text-gold">특급 안심 우체국 택배 (무료배송)</span>
        </div>
        <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-black">
          <span className="text-white">최종 결제금액</span>
          <span className="text-gold font-serif text-base sm:text-lg">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* Hybrid Banner Block */}
      {!user ? (
        <div className="p-4 rounded-2xl bg-[#FEE500]/10 border border-[#FEE500]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mb-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[#FEE500] flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>배송지 입력이 귀찮으신가요?</span>
            </p>
            <p className="text-[11px] text-gray-300 font-medium">카카오 로그인 한 번으로 주소록을 1초 만에 불러옵니다.</p>
          </div>
          <button 
            type="button"
            onClick={onKakaoLogin}
            className="h-10 px-4 bg-[#FEE500] text-[#191919] text-xs font-bold rounded-xl hover:bg-[#FEE500]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#FEE500]/5 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>카카오 1초 로그인</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white/2 border border-white/10 flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs">
              {user.user_metadata?.full_name?.[0] || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user.user_metadata?.full_name}님 로그인됨</p>
              <p className="text-[10px] text-gray-300 font-semibold">배송지 자동완성 혜택 적용 중</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onLogout} 
            className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      )}

      <form onSubmit={handlePay} className="space-y-5 md:space-y-6">
        {/* Social Address Autocomplete selector */}
        {user && deliveryAddresses.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs text-gold font-bold flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>불러온 카카오 배송지 선택</span>
            </label>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50 cursor-pointer transition-all font-medium"
            >
              <option value="" className="bg-[#131313]">-- 직접 입력 (새 주소) --</option>
              {deliveryAddresses.map(addr => (
                <option key={addr.id} value={addr.id} className="bg-[#131313]">
                  {addr.name} ({addr.recipient} / {addr.baseAddress})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Delivery Details */}
        <div className="space-y-4">
          <h4 className="text-xs text-gray-300 font-bold border-b border-white/10 pb-2">배송지 정보</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">수령인 성함</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50 transition-all font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-bold">연락처</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">우편번호</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="우편번호 (선택)"
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50 transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">기본 주소</label>
            <input
              type="text"
              name="baseAddress"
              value={formData.baseAddress}
              onChange={handleChange}
              required
              placeholder="예) 서울시 강남구 테헤란로 123"
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50 transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-300 font-bold">상세 주소</label>
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="예) 101동 1203호"
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold/50 transition-all font-medium"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs text-gray-300 font-bold">결제 수단 선택</h4>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* KakaoPay */}
            <label className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
              formData.paymentMethod === 'kakaopay' 
                ? 'bg-gold/5 border-gold text-gold shadow-md' 
                : 'bg-white/2 border-white/10 text-gray-300 hover:border-white/20'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="kakaopay"
                checked={formData.paymentMethod === 'kakaopay'}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-xs font-bold">카카오페이</span>
            </label>

            {/* TossPay */}
            <label className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
              formData.paymentMethod === 'tosspay' 
                ? 'bg-gold/5 border-gold text-gold shadow-md' 
                : 'bg-white/2 border-white/10 text-gray-300 hover:border-white/20'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="tosspay"
                checked={formData.paymentMethod === 'tosspay'}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-xs font-bold">토스페이</span>
            </label>
          </div>
        </div>

        {/* Secure Sandbox Note */}
        <div className="text-center py-2 text-xs text-gray-400 font-medium">
          🔒 본 결제는 안전한 가상 테스트 결제 모드로 진행됩니다.
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-gold text-black font-extrabold text-sm rounded-xl hover:bg-gold/90 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-gold/5"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>결제 진행 중...</span>
            </>
          ) : (
            <span>{totalAmount.toLocaleString()}원 결제하기</span>
          )}
        </button>
      </form>
    </div>
  );
}
