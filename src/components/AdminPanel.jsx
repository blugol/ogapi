import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Package, Clock, RefreshCw, X, AlertCircle } from 'lucide-react';

export default function AdminPanel({ onClose }) {
  const [orders, setOrders] = useState([]);

  // 로컬 스토리지에서 주문서 데이터 로드
  useEffect(() => {
    const savedOrders = localStorage.getItem('ogapiro_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // 데모용 기본 주문 예시 데이터 삽입 (회의실 시연용)
      const demoOrders = [
        {
          merchant_uid: 'mid_1779284102951',
          recipient: '이몽룡',
          phone: '010-8888-9999',
          address: '서울시 마포구 독막로 123 (상수동아파트 102동 405호)',
          amount: 90000,
          quantity: 2,
          method: 'kakaopay',
          status: '배송 대기',
          created_at: new Date(Date.now() - 3600000 * 3).toLocaleString() // 3시간 전
        },
        {
          merchant_uid: 'mid_1779284305819',
          recipient: '춘향이',
          phone: '010-7777-1111',
          address: '전라북도 남원시 요천로 456 (광한루촌 17호)',
          amount: 45000,
          quantity: 1,
          method: 'tosspay',
          status: '배송 완료',
          created_at: new Date(Date.now() - 3600000 * 24).toLocaleString() // 24시간 전
        }
      ];
      localStorage.setItem('ogapiro_orders', JSON.stringify(demoOrders));
      setOrders(demoOrders);
    }
  }, []);

  // 배송 상태 변경 핸들러
  const handleStatusChange = (merchantUid, currentStatus) => {
    const nextStatus = currentStatus === '배송 대기' ? '배송 중' : currentStatus === '배송 중' ? '배송 완료' : '배송 대기';
    const updatedOrders = orders.map(order => {
      if (order.merchant_uid === merchantUid) {
        return { ...order, status: nextStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('ogapiro_orders', JSON.stringify(updatedOrders));
  };

  // 주문 내역 완전 초기화
  const handleResetOrders = () => {
    if (window.confirm('데모 주문 내역을 모두 초기화하고 초기 상태로 되돌리시겠습니까?')) {
      localStorage.removeItem('ogapiro_orders');
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-5 sm:p-8 rounded-3xl bg-[#131313] border border-gold/10 shadow-2xl text-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
        <div>
          <span className="inline-flex items-center space-x-1.5 bg-gold/10 text-gold px-3 py-1.5 rounded-full text-xs font-bold mb-1">
            <ShieldCheck className="w-3 h-3" />
            <span>조선행도가 주문 관리자</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold">오가피로 주문 및 배송 관리 어드민</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center space-x-3.5">
          <Clock className="w-6 h-6 text-gold" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">배송 대기</p>
            <p className="text-lg sm:text-2xl font-bold font-serif">{orders.filter(o => o.status === '배송 대기').length}건</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center space-x-3.5">
          <Truck className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">배송 중</p>
            <p className="text-lg sm:text-2xl font-bold font-serif">{orders.filter(o => o.status === '배송 중').length}건</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center space-x-3.5">
          <Package className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">배송 완료</p>
            <p className="text-lg sm:text-2xl font-bold font-serif">{orders.filter(o => o.status === '배송 완료').length}건</p>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/5 bg-white/3 text-gray-400 font-semibold uppercase tracking-wider">
              <th className="p-4">주문 일자 / 번호</th>
              <th className="p-4">주문 상품 / 수량</th>
              <th className="p-4">수령인 / 연락처</th>
              <th className="p-4">배송지 주소</th>
              <th className="p-4">결제액 / 수단</th>
              <th className="p-4 text-center">배송 상태 조절 (클릭)</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 text-sm">
                  <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  아직 접수된 테스트 주문 내역이 없습니다. <br/>
                  모바일에서 직접 테스트 결제를 성공하면 이곳에 실시간으로 기록됩니다.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.merchant_uid} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4 font-light text-gray-400">
                    <span className="block text-[10px]">{order.created_at}</span>
                    <span className="block font-mono text-[10px] text-white font-medium">{order.merchant_uid}</span>
                  </td>
                  <td className="p-4 font-medium">
                    오가피로 750ml <br/>
                    <span className="text-gold text-[10px]">{order.quantity}병</span>
                  </td>
                  <td className="p-4 font-medium text-gray-300">
                    {order.recipient} <br/>
                    <span className="text-[10px] text-gray-500">{order.phone}</span>
                  </td>
                  <td className="p-4 font-light text-gray-400 max-w-[200px] truncate" title={order.address}>
                    {order.address}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold font-serif block text-white">{order.amount.toLocaleString()}원</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-semibold inline-block mt-1">
                      {order.method === 'kakaopay' ? '카카오페이' : '토스페이'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusChange(order.merchant_uid, order.status)}
                      className={`h-8 px-3 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all ${
                        order.status === '배송 대기' 
                          ? 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20' 
                          : order.status === '배송 중'
                          ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20 hover:bg-blue-400/20'
                          : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20'
                      }`}
                    >
                      {order.status} ➔
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reset Tool */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/5">
        <p className="text-[10px] text-gray-500">
          💡 **회의 시연 가이드**: 배송 상태의 버튼을 클릭하면 `배송 대기 ➔ 배송 중 ➔ 배송 완료` 순으로 상태가 실시간 토글됩니다.
        </p>
        <button
          onClick={handleResetOrders}
          className="flex items-center space-x-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>데모 내역 리셋</span>
        </button>
      </div>
    </div>
  );
}
