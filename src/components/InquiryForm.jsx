import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'framer-motion';

export default function InquiryForm() {
  const [state, handleSubmit] = useForm("xzdyknre");

  if (state.succeeded) {
    return (
      <div className="text-center p-10 glass-panel rounded-xl">
        <h3 className="text-2xl font-bold gold-gradient mb-4">문의가 성공적으로 접수되었습니다.</h3>
        <p className="text-gray-200">빠른 시일 내에 연락드리겠습니다. 감사합니다.</p>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto py-20 px-6"
      id="inquiry"
    >
      <div className="glass-panel p-8 md:p-12 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <h2 className="text-4xl font-bold mb-2 text-white">구매 및 제휴 문의</h2>
        <p className="text-gold mb-10">오가피로와 함께할 파트너를 기다립니다.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-200 mb-2">성함 / 업체명</label>
              <input
                id="name"
                type="text" 
                name="name"
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-white"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-200 mb-2">이메일 주소</label>
              <input
                id="email"
                type="email" 
                name="email"
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-white"
                placeholder="example@email.com"
              />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-200 mb-2">연락처</label>
            <input
              id="phone"
              type="text" 
              name="phone"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-white"
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-gray-200 mb-2">문의 내용</label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors text-white"
              placeholder="제휴 혹은 구매 수량 등 자유롭게 적어주세요."
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="w-full py-4 bg-gold hover:bg-gold-dark text-black font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
          >
            {state.submitting ? "전송 중..." : "문의하기"}
          </button>

          {state.errors && !state.succeeded && (
            <p className="text-red-500 text-sm text-center mt-4">
              오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          )}
        </form>
      </div>
    </motion.section>
  );
}
