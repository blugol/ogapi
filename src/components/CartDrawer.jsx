import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Cart Sidebar Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md h-full bg-[#0d0d0d] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-gold" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gold text-black font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-sans">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">귀하의 장바구니</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                /* Empty Cart Screen */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-12">
                  <div className="w-16 h-16 rounded-full bg-white/3 border border-white/5 flex items-center justify-center text-gray-500">
                    <ShoppingBag className="w-8 h-8 text-gold/40" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-serif font-semibold text-gray-200">장바구니가 비어 있습니다</h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed max-w-[250px] mx-auto">
                      조선행도가 장인의 헌신이 담긴 명품 오가피 농축액을 담아 몸과 마음에 기품을 선물해 보십시오.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="border border-gold/30 hover:border-gold hover:bg-gold hover:text-black text-gold text-xs px-6 py-2.5 rounded-full font-semibold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    쇼핑 계속하기
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-2xl bg-white/2 border border-white/5 flex gap-4 items-center justify-between"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        <img 
                          src={item.image || '/assets/story_2.png'} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Quantity Controls */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <h4 className="text-xs font-serif font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-gold font-serif">{item.price.toLocaleString()}원</p>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-serif text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-[#090909] border-t border-white/5 space-y-5">
                {/* Total Calculations */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>배송 방식</span>
                    <span className="text-gold font-medium">우체국 무료 안심 배송</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                    <span className="text-sm font-serif font-semibold text-white">최종 결제 금액</span>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black font-serif text-gold">{totalAmount.toLocaleString()}</span>
                      <span className="text-xs text-gold ml-1">원</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Trust Badge */}
                <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 flex items-start space-x-2 text-[10px] text-gray-400 leading-normal font-light">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>
                    조선행도가의 모든 포장 박스는 철저한 항온·항습 관리를 거치며, 파손을 전면 차단하는 특수 에어셀 안전 패키징으로 발송됩니다.
                  </span>
                </div>

                {/* Checkout CTA Button */}
                <button
                  onClick={onCheckout}
                  className="w-full h-13 bg-gold text-black font-bold text-xs sm:text-sm rounded-xl hover:bg-gold/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-gold/5 uppercase tracking-widest"
                >
                  <span>결제 주문서 작성하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
