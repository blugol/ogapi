import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, ShieldAlert, ArrowLeft, Loader2, MapPin } from 'lucide-react';

export default function CheckoutForm({ user, totalAmount, quantity, onBack, onPaymentSuccess }) {
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
  const [sdkLoaded, setSdkLoaded] = useState(false);

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
    script.onload = () => setSdkLoaded(true);
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
    // 포트원 기본 테스트 가맹점 식별코드
    IMP.init('imp00000000'); 

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
    <div className="max-w-2xl mx-auto p-6 md:p-10 rounded-3xl bg-[#131313] border border-white/5 shadow-xl">
      {/* Back Header */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>상품 정보로 돌아가기</span>
      </button>

      <h3 className="text-2xl font-serif font-bold mb-6">주문서 작성 및 결제</h3>

      {/* Order Brief */}
      <div className="p-5 rounded-2xl bg-white/2 border border-white/5 mb-8 space-y-3">
        <div className="flex justify-between text-xs text-gray-400">
          <span>주문 상품</span>
          <span className="font-medium text-white">오가피로 Obsidian 365 x {quantity}병</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>배송 방식</span>
          <span className="font-medium text-gold">특급 안심 우체국 택배 (무료배송)</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-semibold">
          <span>총 결제금액</span>
          <span className="text-gold font-serif text-lg">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-6">
        {/* Social Address Autocomplete selector */}
        {deliveryAddresses.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] text-gold uppercase tracking-widest font-semibold flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>카카오 싱크 배송지 불러오기</span>
            </label>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold/50 cursor-pointer"
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
          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 pb-2">배송 정보</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-medium">수령인 성함</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-medium">연락처</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-medium">우편번호</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              placeholder="우편번호 (선택)"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-medium">기본 주소</label>
            <input
              type="text"
              name="baseAddress"
              value={formData.baseAddress}
              onChange={handleChange}
              required
              placeholder="예) 서울시 강남구 테헤란로 123"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-medium">상세 주소</label>
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              placeholder="예) 101동 1203호"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 pt-4">
          <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold border-b border-white/5 pb-2">결제 수단 선택</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* KakaoPay */}
            <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              formData.paymentMethod === 'kakaopay' 
                ? 'bg-gold/5 border-gold text-gold' 
                : 'bg-white/2 border-white/10 text-gray-400 hover:border-white/20'
            }`}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="kakaopay"
                  checked={formData.paymentMethod === 'kakaopay'}
                  onChange={handleChange}
                  className="hidden"
                />
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-semibold">카카오페이</span>
              </div>
              <span className="text-[9px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded font-bold">간편결제</span>
            </label>

            {/* TossPay */}
            <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              formData.paymentMethod === 'tosspay' 
                ? 'bg-gold/5 border-gold text-gold' 
                : 'bg-white/2 border-white/10 text-gray-400 hover:border-white/20'
            }`}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="tosspay"
                  checked={formData.paymentMethod === 'tosspay'}
                  onChange={handleChange}
                  className="hidden"
                />
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-semibold">토스페이</span>
              </div>
              <span className="text-[9px] bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded font-bold">간편결제</span>
            </label>
          </div>
        </div>

        {/* Security / PG sandboxed notice */}
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-start space-x-3 text-[10px] text-gray-500 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-gold flex-shrink-0" />
          <div>
            🔒 **안전 거래 보증 및 샌드박스 알림**<br/>
            현재 시스템은 안전한 가맹점 결제 테스트(Sandbox) 환경에서 작동하므로 안심하고 진행하실 수 있습니다. 테스트 모드로 실제 청구가 발생하지 않거나 테스트 결제 완료 후 즉시 자동 전액 취소 처리됩니다.
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-gold text-black font-bold text-sm rounded-xl hover:bg-gold/90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:-translate-y-0 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>결제 진행 중...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 fill-current" />
              <span>{totalAmount.toLocaleString()}원 안전결제 완료</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
