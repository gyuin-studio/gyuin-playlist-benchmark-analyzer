import React from 'react';
import { Compass, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200/90 bg-stone-100/60 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        {/* Quote Card */}
        <div className="bg-white/90 backdrop-blur-xs p-6 rounded-2xl border border-stone-200/80 shadow-xs max-w-2xl mx-auto">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <Compass className="w-4 h-4 text-emerald-700" />
          </div>
          <blockquote className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed tracking-tight">
            “이 도구는 플레이리스트를 복제하기 위한 도구가 아니라,<br className="hidden sm:inline" />
            잘 되는 구조를 분석하고 나만의 콘셉트로 바꾸기 위한 기획 도구입니다.”
          </blockquote>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            규인 플리 벤치마킹 분석기 • Creator Planning Worksheet
          </p>
        </div>

        {/* Small Notice */}
        <div className="text-xs text-stone-600 space-y-1">
          <p>
            본 도구는 사용자 브라우저 로컬 환경에서만 작동하며, 외부 서버로 데이터를 전송하거나 API를 호출하지 않습니다.
          </p>
          <p className="text-stone-600">
            © 규인 플리 벤치마킹 분석기. 유튜브 플레이리스트 채널 기획자를 위한 워크시트.
          </p>
        </div>
      </div>
    </footer>
  );
};
