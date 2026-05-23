import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginKakao, onLoginGoogle, isDemoMode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#131313] p-6 sm:p-8 border border-gold/10 shadow-2xl shadow-black/80 mx-auto"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-5 top-5 sm:right-6 sm:top-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Accent */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gold/5 blur-3xl" />

            {/* Header */}
            <div className="text-center mt-3 sm:mt-4 mb-6 sm:mb-8 space-y-3">
              <span className="inline-flex items-center space-x-1 bg-gold/10 text-gold px-3 py-1 rounded-full text-xs tracking-widest font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Second Easy Login</span>
              </span>
              <h3 className="text-2xl font-serif font-bold tracking-tight text-white">조선행도가 로그인</h3>
              <p className="text-xs text-gray-200 max-w-[300px] mx-auto leading-relaxed font-medium">
                로그인 후 카카오에 등록된 기본 배송지 주소를 자동으로 가져와 편리하게 주문을 완료하실 수 있습니다.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3.5">
              {/* Kakao Login */}
              <button 
                onClick={onLoginKakao}
                className="w-full h-13 sm:h-14 flex items-center justify-center space-x-3 bg-[#FEE500] text-[#191919] font-bold rounded-2xl hover:bg-[#FEE500]/90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md shadow-[#FEE500]/10 cursor-pointer"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current" />
                <span className="text-xs sm:text-sm">카카오톡으로 1초 만에 시작하기</span>
              </button>

              {/* Google Login */}
              <button 
                onClick={onLoginGoogle}
                className="w-full h-13 sm:h-14 flex items-center justify-center space-x-3 bg-white/5 border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {/* Custom Google SVG */}
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.015c1.614 0 3.08.643 4.16 1.685l3.228-3.228A10.18 10.18 0 0 0 13.99 1.5C8.47 1.5 4 5.97 4 11.5S8.47 21.5 13.99 21.5c5.37 0 9.81-3.87 9.81-9.5 0-.58-.06-1.16-.18-1.715h-11.38z" />
                </svg>
                <span className="text-xs sm:text-sm">구글 계정으로 계속하기</span>
              </button>
            </div>

            {/* Demo Mode Notice */}
            {isDemoMode && (
              <div className="mt-6 sm:mt-8 p-4 rounded-xl bg-gold/5 border border-gold/20 text-xs text-gold font-bold text-center leading-relaxed">
                💡 **로컬 개발/시뮬레이션 모드 활성화**<br/>
                현재 Supabase 연동 전으로, 버튼 클릭 시 가상의 카카오 싱크/구글 프로필과 주소록이 주입되는 **체험 데모 로그인**이 자동 진행됩니다.
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
