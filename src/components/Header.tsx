import React from 'react';
import { Headphones, RotateCcw, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  activeStep: number;
  hasAnalyzed: boolean;
  onJumpToStep: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  activeStep,
  hasAnalyzed,
  onJumpToStep
}) => {
  return (
    <header className="border-b border-stone-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shadow-emerald-900/10 shrink-0">
              <Headphones className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  규인 플리 벤치마킹 분석기
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  기획 워크시트
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                잘 되는 플레이리스트의 구조를 분석해 나만의 독창적인 콘셉트로 재탄생시키는 실전 도구
              </p>
            </div>
          </div>

          {/* Reset button only - sample buttons removed to prevent data mixing */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 bg-stone-50 cursor-pointer shadow-2xs"
              title="입력 내용 전체 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="font-medium">새로 작성 (전체 초기화)</span>
            </button>
          </div>
        </div>

        {/* Step progress pills */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between overflow-x-auto text-xs pb-1 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => onJumpToStep(1)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeStep === 1
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 text-[11px] flex items-center justify-center font-bold">1</span>
              1단계: 정보 입력
            </button>
            <span className="text-stone-300">›</span>

            <button
              onClick={() => hasAnalyzed && onJumpToStep(2)}
              disabled={!hasAnalyzed}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !hasAnalyzed
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  : activeStep === 2
                  ? 'bg-emerald-800 text-white shadow-xs cursor-pointer'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 cursor-pointer'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 text-[11px] flex items-center justify-center font-bold">2</span>
              2단계: 구조 분석
            </button>
            <span className="text-stone-300">›</span>

            <button
              onClick={() => hasAnalyzed && onJumpToStep(3)}
              disabled={!hasAnalyzed}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !hasAnalyzed
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  : activeStep === 3
                  ? 'bg-emerald-800 text-white shadow-xs cursor-pointer'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 cursor-pointer'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/15 text-[11px] flex items-center justify-center font-bold">3</span>
              3단계: 새 기획안
            </button>
            <span className="text-stone-300">›</span>

            <button
              onClick={() => hasAnalyzed && onJumpToStep(4)}
              disabled={!hasAnalyzed}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                !hasAnalyzed
                  ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                  : activeStep === 4
                  ? 'bg-emerald-800 text-white shadow-xs cursor-pointer'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 cursor-pointer'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              4단계: 복사 및 저장
            </button>
          </div>

          <div className="text-[11px] text-stone-600 hidden sm:flex items-center gap-1.5 pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            브라우저 로컬 전용 (외부 전송 없음)
          </div>
        </div>
      </div>
    </header>
  );
};
