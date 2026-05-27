import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Package, Clock, RefreshCw, X, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function AdminPanel({ onClose }) {
  const [orders, setOrders] = useState([]);

  // API에서 실제 주문 데이터 로드
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await api.getOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);


  // 배송 상태 변경 핸들러 (API 호출)
  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus = currentStatus === '입금대기' ? '배송대기' : currentStatus === '배송대기' ? '배송중' : currentStatus === '배송중' ? '배송완료' : '배송대기';
    
    // UI 낙관적 업데이트
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    
    try {
      await api.updateOrderStatus(id, nextStatus);
    } catch (err) {
      console.error('상태 업데이트 실패', err);
      // 롤백 로직 (생략가능)
    }
  };

  // 새로고침
  const handleRefresh = async () => {
    const data = await api.getOrders();
    setOrders(data);
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
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">배송대기</p>
            <p className="text-lg sm:text-2xl font-bold font-serif">{orders.filter(o => o.status === '배송대기' || o.status === '입금대기').length}건</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center space-x-3.5">
          <Truck className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">배송중</p>
            <p className="text-lg sm:text-2xl font-bold font-serif">{orders.filter(o => o.status === '배송중').length}건</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center space-x-3.5">
          <Package className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">배송완료</p>
            <p className="text-lg sm:text-2xl font-bold font-serif">{orders.filter(o => o.status === '배송완료').length}건</p>
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
                  아직 접수된 주문 내역이 없습니다.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4 font-light text-gray-400">
                    <span className="block text-[10px]">{new Date(order.date).toLocaleString()}</span>
                    <span className="block font-mono text-[10px] text-white font-medium">{order.id}</span>
                  </td>
                  <td className="p-4 font-medium">
                    {order.items && order.items.length > 0 && (
                      order.items.map((item, i) => (
                        <div key={i}>
                          <span>{item.name}</span><br/>
                          <span className="text-gold text-[10px]">{item.quantity}병</span>
                        </div>
                      ))
                    )}
                    {order.memo && (
                      <span className="block text-[9px] text-gray-500 mt-1">메모: {order.memo}</span>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-300">
                    {order.customerName} <br/>
                    <span className="text-[10px] text-gray-500">{order.phone}</span>
                  </td>
                  <td className="p-4 font-light text-gray-400 max-w-[200px] truncate" title={order.shippingAddress}>
                    {order.shippingAddress}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold font-serif block text-white">{order.totalAmount.toLocaleString()}원</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleStatusChange(order.id, order.status)}
                      className={`h-8 px-3 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all ${
                        order.status === '배송대기' || order.status === '입금대기'
                          ? 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20' 
                          : order.status === '배송중'
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

      {/* Refresh Tool */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/5">
        <p className="text-[10px] text-gray-500">
          💡 **실시간 연동**: 상태 버튼 클릭 시 데이터베이스에 실시간으로 반영됩니다.
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>새로고침</span>
        </button>
      </div>
    </div>
  );
}
