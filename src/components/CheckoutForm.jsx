import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, MapPin, MessageCircle, Copy, CheckCircle, Info } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'kakaopay', label: '카카오페이', icon: '💛', desc: '카카오 간편결제', pg: 'kakaopay.TC00000000' },
  { id: 'tosspay',  label: '토스페이',   icon: '🔵', desc: '토스 간편결제',   pg: 'tosspay.tosstest' },
  { id: 'bank',     label: '무통장 입금', icon: '🏦', desc: '계좌이체 후 확인', pg: null }
];

const BANK_INFO = {
  bank: '농협회원조합',
  account: '351-1364-2054-03',
  holder: '농업회사법인 조선행도가 주식회사',
  note: '입금 확인 후 1~2 영업일 내 발송됩니다.'
};

export default function CheckoutForm({ user, totalAmount, quantity, onBack, onPaymentSuccess, onKakaoLogin, onLogout, cartItems = [] }) {
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [copied, setCopied] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    phone: '',
    zipcode: '',
    baseAddress: '',
    detailAddress: '',
    memo: '',
    paymentMethod: 'kakaopay'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryAddresses = user?.user_metadata?.delivery_addresses || [];

  // 카카오 배송지 자동완성
  useEffect(() => {
    if (selectedAddressId) {
      const selected = deliveryAddresses.find(a => a.id === selectedAddressId);
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
  }, [selectedAddressId, user]);

  // 포트원 + Daum 스크립트 동적 로드 (중복 방지)
  useEffect(() => {
    const loadScript = (src, id, onLoad) => {
      if (document.getElementById(id)) { onLoad && onLoad(); return; }
      const s = document.createElement('script');
      s.src = src; s.id = id; s.async = true;
      if (onLoad) s.onload = onLoad;
      document.body.appendChild(s);
    };

    loadScript(
      'https://cdn.iamport.kr/v1/iamport.js',
      'portone-sdk',
      () => setSdkReady(true)
    );
    loadScript(
      'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js',
      'daum-postcode',
      null
    );

    // 이미 로드된 경우 바로 ready
    if (window.IMP) setSdkReady(true);
  }, []);

  // 주소 찾기 (Daum Postcode)
  const handlePostcode = () => {
    if (window.daum?.Postcode) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
          let extra = '';
          if (data.userSelectedType === 'R') {
            if (data.bname && /[동|로|가]$/.test(data.bname)) extra += data.bname;
            if (data.buildingName && data.apartment === 'Y')
              extra += (extra ? ', ' + data.buildingName : data.buildingName);
            if (extra) extra = ' (' + extra + ')';
          }
          setFormData(prev => ({ ...prev, zipcode: data.zonecode, baseAddress: addr + extra }));
        }
      }).open();
    } else {
      alert('주소 검색 서비스를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // 계좌번호 복사
  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const validate = () => {
    if (!formData.recipient.trim()) return '수령인 성함을 입력해주세요.';
    if (!formData.phone.trim()) return '연락처를 입력해주세요.';
    if (!formData.baseAddress.trim()) return '배송지 주소를 입력해주세요. (주소 찾기 버튼 사용)';
    return null;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const validErr = validate();
    if (validErr) { setError(validErr); return; }

    setLoading(true);
    setError('');

    const merchant_uid = `ogapiro_${Date.now()}`;
    const fullAddress = `${formData.baseAddress} ${formData.detailAddress}`.trim();

    // 무통장 입금 처리
    if (formData.paymentMethod === 'bank') {
      setTimeout(() => {
        setLoading(false);
        onPaymentSuccess({
          merchant_uid,
          amount: totalAmount,
          recipient: formData.recipient,
          phone: formData.phone,
          address: fullAddress,
          memo: formData.memo,
          method: '무통장 입금',
          bank: BANK_INFO
        });
      }, 800);
      return;
    }

    // 온라인 결제 (Portone)
    if (!window.IMP || !sdkReady) {
      // SDK 미로드 시 데모 시뮬레이션
      console.warn('[DEMO] Portone SDK not loaded — running payment simulation');
      setTimeout(() => {
        setLoading(false);
        onPaymentSuccess({
          merchant_uid,
          amount: totalAmount,
          recipient: formData.recipient,
          phone: formData.phone,
          address: fullAddress,
          memo: formData.memo,
          method: formData.paymentMethod === 'kakaopay' ? '카카오페이 (데모)' : '토스페이 (데모)'
        });
      }, 1500);
      return;
    }

    const IMP = window.IMP;
    IMP.init('imp86612685');

    const pg = PAYMENT_METHODS.find(m => m.id === formData.paymentMethod)?.pg || 'kakaopay.TC00000000';
    const payName = cartItems.length > 0
      ? cartItems.map(i => `${i.name} ×${i.quantity}`).join(', ')
      : `오가피로 ${quantity}병`;

    IMP.request_pay({
      pg,
      pay_method: formData.paymentMethod === 'tosspay' ? 'tosspay' : 'card',
      merchant_uid,
      name: payName,
      amount: totalAmount,
      buyer_email: user?.email || '',
      buyer_name: formData.recipient,
      buyer_tel: formData.phone,
      buyer_addr: fullAddress,
      buyer_postcode: formData.zipcode
    }, (rsp) => {
      setLoading(false);
      if (rsp.success) {
        onPaymentSuccess({
          imp_uid: rsp.imp_uid,
          merchant_uid: rsp.merchant_uid,
          amount: rsp.paid_amount,
          recipient: formData.recipient,
          phone: formData.phone,
          address: fullAddress,
          memo: formData.memo,
          method: formData.paymentMethod === 'kakaopay' ? '카카오페이' : '토스페이'
        });
      } else {
        if (rsp.error_msg?.includes('취소')) {
          setError('결제가 취소되었습니다. 다시 시도해주세요.');
        } else {
          setError(`결제 실패: ${rsp.error_msg || '다시 시도해주세요.'}`);
        }
      }
    });
  };

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === formData.paymentMethod);

  return (
    <div className="w-full max-w-2xl mx-auto p-5 sm:p-8 rounded-3xl bg-[#131313] border border-white/5 shadow-2xl">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sm text-gray-200 hover:text-white mb-6 transition-colors cursor-pointer font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-gold" />
        <span>뒤로 가기</span>
      </button>

      <h3 className="text-xl sm:text-2xl font-bold mb-5 text-white">주문서 작성</h3>

      {/* 주문 내역 요약 */}
      <div className="p-4 rounded-2xl bg-white/3 border border-white/10 mb-5 space-y-2.5">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-white/5 pb-2">주문 내역</p>
        {cartItems.length > 0 ? cartItems.map(item => (
          <div key={item.id} className="flex justify-between text-xs font-semibold text-white">
            <div className="flex items-center gap-2">
              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
              <span>{item.name}</span>
            </div>
            <span className="text-gold font-serif">{item.quantity}병 / {(item.price * item.quantity).toLocaleString()}원</span>
          </div>
        )) : (
          <div className="flex justify-between text-xs font-semibold text-white">
            <span>오가피로 750ml</span>
            <span className="text-gold font-serif">{quantity}병 / {totalAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-gray-400">
          <span>배송</span>
          <span className="font-bold text-gold">우체국 택배 (무료)</span>
        </div>
        <div className="flex justify-between text-sm font-black border-t border-white/10 pt-2.5">
          <span className="text-white">최종 결제금액</span>
          <span className="text-gold font-serif text-base">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 로그인 배너 or 로그인 상태 */}
      {!user ? (
        <div className="p-4 rounded-2xl bg-[#FEE500]/5 border border-[#FEE500]/20 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-bold text-white">카카오 로그인으로 배송지 자동완성</p>
            <p className="text-[11px] text-gray-400 mt-0.5">로그인 없이도 아래에 직접 입력하실 수 있습니다.</p>
          </div>
          <button
            type="button"
            onClick={onKakaoLogin}
            className="shrink-0 h-9 px-4 bg-[#FEE500] text-[#191919] text-xs font-bold rounded-xl hover:bg-[#FEE500]/90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            카카오 로그인 (선택)
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-white/3 border border-white/10 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-xs">
              {user.user_metadata?.full_name?.[0] || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{user.user_metadata?.full_name}님 로그인됨</p>
              <p className="text-[10px] text-gray-400">배송지 자동완성 사용 중</p>
            </div>
          </div>
          <button type="button" onClick={onLogout} className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer">로그아웃</button>
        </div>
      )}

      <form onSubmit={handlePay} className="space-y-5">
        {/* 저장된 배송지 선택 */}
        {user && deliveryAddresses.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs text-gold font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> 저장된 배송지 선택
            </label>
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all cursor-pointer"
            >
              <option value="" className="bg-[#131313]">-- 직접 입력 --</option>
              {deliveryAddresses.map(a => (
                <option key={a.id} value={a.id} className="bg-[#131313]">{a.name} — {a.recipient}</option>
              ))}
            </select>
          </div>
        )}

        {/* 배송지 입력 */}
        <div className="space-y-3">
          <h4 className="text-xs text-gray-400 font-bold border-b border-white/10 pb-2">배송지 정보</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold">수령인 *</label>
              <input type="text" name="recipient" value={formData.recipient} onChange={handleChange} required placeholder="이름"
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-bold">연락처 *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="010-0000-0000"
                className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-medium" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold">우편번호 *</label>
            <div className="flex gap-2">
              <input type="text" name="zipcode" value={formData.zipcode} readOnly placeholder="우편번호"
                className="flex-1 h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-medium cursor-default" />
              <button type="button" onClick={handlePostcode}
                className="px-4 bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap">
                주소 찾기
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold">기본 주소 *</label>
            <input type="text" name="baseAddress" value={formData.baseAddress} onChange={handleChange} required placeholder="주소 찾기 버튼을 이용해 주세요"
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-medium" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold">상세 주소</label>
            <input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleChange} placeholder="예) 101동 1203호"
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-medium" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-bold">배송 메모 (선택)</label>
            <input type="text" name="memo" value={formData.memo} onChange={handleChange} placeholder="예) 경비실에 맡겨주세요"
              className="w-full h-11 px-4 rounded-xl bg-white/3 border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all font-medium" />
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs text-gray-400 font-bold border-b border-white/10 pb-2">결제 수단</h4>
          <div className="grid grid-cols-3 gap-2.5">
            {PAYMENT_METHODS.map(method => (
              <label key={method.id} className={`flex flex-col items-center p-3.5 rounded-xl border cursor-pointer transition-all text-center ${
                formData.paymentMethod === method.id
                  ? 'bg-gold/10 border-gold text-gold'
                  : 'bg-white/3 border-white/10 text-gray-300 hover:border-white/20'
              }`}>
                <input type="radio" name="paymentMethod" value={method.id} checked={formData.paymentMethod === method.id} onChange={handleChange} className="hidden" />
                <span className="text-xl mb-1">{method.icon}</span>
                <span className="text-[11px] font-bold leading-tight">{method.label}</span>
                <span className="text-[9px] text-gray-500 mt-0.5">{method.desc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 무통장 입금 안내 */}
        {formData.paymentMethod === 'bank' && (
          <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-700/30 space-y-3">
            <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> 무통장 입금 안내
            </p>
            <div className="space-y-1.5 text-xs text-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-400">은행</span>
                <span className="font-bold">{BANK_INFO.bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">계좌번호</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{BANK_INFO.account}</span>
                  <button type="button" onClick={handleCopyAccount}
                    className="flex items-center gap-1 text-gold hover:text-white transition-colors text-[10px] font-bold cursor-pointer">
                    {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? '복사됨' : '복사'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">예금주</span>
                <span className="font-bold text-[11px]">{BANK_INFO.holder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">입금액</span>
                <span className="font-bold text-gold">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
            <p className="text-[10px] text-amber-500/80 bg-amber-900/30 rounded-lg p-2">{BANK_INFO.note}</p>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-900/20 border border-red-700/30 text-xs text-red-400 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* 결제 안내 */}
        <div className="text-center text-[10px] text-gray-500 py-1 flex items-center justify-center gap-1.5">
          <span>🔒</span>
          <span>
            {formData.paymentMethod === 'bank'
              ? '무통장 입금 주문 후 입금 확인 시 배송이 시작됩니다.'
              : '테스트 결제 모드 — 실제 금액이 청구되지 않습니다.'}
          </span>
        </div>

        {/* CTA 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-gold text-black font-extrabold text-sm rounded-xl hover:bg-gold/90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-gold/10 disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>처리 중...</span></>
          ) : (
            <span>
              {formData.paymentMethod === 'bank'
                ? `${totalAmount.toLocaleString()}원 무통장 주문하기`
                : `${totalAmount.toLocaleString()}원 결제하기`}
            </span>
          )}
        </button>

        <p className="text-center text-[10px] text-gray-600">
          주문 버튼 클릭 시 <span className="text-gray-500 underline cursor-pointer">이용약관</span> 및 <span className="text-gray-500 underline cursor-pointer">개인정보 처리방침</span>에 동의한 것으로 간주합니다.
        </p>
      </form>
    </div>
  );
}
