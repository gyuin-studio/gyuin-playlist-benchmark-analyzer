import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Step1InputForm } from './components/Step1InputForm';
import { Step2AnalysisCard } from './components/Step2AnalysisCard';
import { Step3PlanningCard } from './components/Step3PlanningCard';
import { Step4ExportBar } from './components/Step4ExportBar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { BenchmarkInput, AnalysisResult, PlanningResult, SavedPlan, AnalysisInputPayload } from './types/playlist';
import { generateAnalysis, generatePlanning, formatFullPlanAsText } from './services/analyzer';

const INITIAL_INPUT: BenchmarkInput = {
  title: '',
  channelName: '',
  viewsEngagement: '',
  duration: '',
  uploadPeriod: '',
  thumbnailDesc: '',
  musicGenreMood: '',
  targetSituation: '',
  commentReactions: '',
  userDirection: '',
  thumbnailImage: null
};

const STORAGE_SAVED_PLANS_KEY = 'gyuin_saved_plans_v1';
const STORAGE_CURRENT_INPUT_KEY = 'gyuin_current_input_v1';

export default function App() {
  // 1. 초기 상태는 완전한 빈 상태로 시작 (샘플 데이터 자동 주입 없음)
  const [input, setInput] = useState<BenchmarkInput>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_INPUT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.title?.includes('새벽 2시') ||
          parsed.title?.includes('성수동 통창') ||
          parsed.title?.includes('올림픽대로')
        ) {
          localStorage.removeItem(STORAGE_CURRENT_INPUT_KEY);
          return INITIAL_INPUT;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_INPUT;
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [analysisInput, setAnalysisInput] = useState<AnalysisInputPayload | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [planning, setPlanning] = useState<PlanningResult | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_PLANS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  // Auto-save input draft to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_INPUT_KEY, JSON.stringify(input));
    } catch {
      // ignore
    }
  }, [input]);

  // Save plans list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_PLANS_KEY, JSON.stringify(savedPlans));
    } catch {
      // ignore
    }
  }, [savedPlans]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(`'${label}' 복사 완료!`);
    } catch {
      showToast('클립보드 복사에 실패했습니다.');
    }
  };

  const handleInputChange = (field: keyof BenchmarkInput, value: any) => {
    setInput((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 1. 새 분석 시작 버튼을 누르면 모든 입력값, 분석 결과를 완전히 초기화
  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setSelectedTags([]);
    setAnalysisInput(null);
    setAnalysis(null);
    setPlanning(null);
    setActiveStep(1);
    try {
      localStorage.removeItem(STORAGE_CURRENT_INPUT_KEY);
    } catch {
      // ignore
    }
    showToast('모든 입력값과 분석 결과가 완전히 초기화되었습니다.');
  };

  const handleSubmitAnalysis = (e: React.FormEvent, mode: 'quick' | 'deep' = 'quick') => {
    e.preventDefault();

    // 필수 입력 검증 (4개 항목)
    if (!input.title.trim()) {
      showToast('필수 항목: 벤치마킹 영상 제목을 입력해주세요.');
      return;
    }
    if (!input.thumbnailDesc.trim() && !input.thumbnailImage) {
      showToast('필수 항목: 썸네일 분위기 설명(또는 썸네일 이미지)을 입력해주세요.');
      return;
    }
    if (!input.musicGenreMood.trim()) {
      showToast('필수 항목: 음악 장르/분위기를 입력해주세요.');
      return;
    }
    if (!input.userDirection.trim()) {
      showToast('필수 항목: 내가 만들고 싶은 채널 또는 플레이리스트 방향을 입력해주세요.');
      return;
    }

    // 1. 분석 전용 입력 객체 만들기
    // analysisInput = { title, thumbnailText, musicMood, direction, optional, selectedTags }
    const payload: AnalysisInputPayload = {
      title: input.title.trim(),
      thumbnailText: input.thumbnailDesc.trim(),
      musicMood: input.musicGenreMood.trim(),
      direction: input.userDirection.trim(),
      optional: {
        channelName: input.channelName.trim(),
        viewsEngagement: input.viewsEngagement.trim(),
        duration: input.duration.trim(),
        uploadPeriod: input.uploadPeriod.trim(),
        targetSituation: input.targetSituation.trim(),
        commentReactions: input.commentReactions.trim(),
      },
      selectedTags: [...selectedTags],
      thumbnailImage: input.thumbnailImage || null
    };

    setIsAnalyzing(true);
    setTimeout(() => {
      // 100% analysisInput만 분석 및 기획안 생성에 사용
      const a = generateAnalysis(payload);
      const p = generatePlanning(payload, a);
      setAnalysisInput(payload);
      setAnalysis(a);
      setPlanning(p);
      setIsAnalyzing(false);
      setActiveStep(2);
      showToast(mode === 'deep' ? '깊이 분석이 완료되었습니다!' : '빠른 분석이 완료되었습니다!');

      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 200);
  };

  const handleJumpToStep = (step: number) => {
    setActiveStep(step);
    if (step === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 3) {
      step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 4) {
      step4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyAll = () => {
    if (!analysis || !planning) return;
    const payload: AnalysisInputPayload = analysisInput || {
      title: input.title,
      thumbnailText: input.thumbnailDesc,
      musicMood: input.musicGenreMood,
      direction: input.userDirection,
      optional: {
        channelName: input.channelName,
        viewsEngagement: input.viewsEngagement,
        duration: input.duration,
        uploadPeriod: input.uploadPeriod,
        targetSituation: input.targetSituation,
        commentReactions: input.commentReactions
      },
      selectedTags: selectedTags,
      thumbnailImage: input.thumbnailImage
    };
    const fullText = formatFullPlanAsText(payload, analysis, planning);
    copyToClipboard(fullText, '전체 기획안 리포트');
  };

  const handleSavePlan = () => {
    if (!analysis || !planning) return;
    const payload: AnalysisInputPayload = analysisInput || {
      title: input.title,
      thumbnailText: input.thumbnailDesc,
      musicMood: input.musicGenreMood,
      direction: input.userDirection,
      optional: {
        channelName: input.channelName,
        viewsEngagement: input.viewsEngagement,
        duration: input.duration,
        uploadPeriod: input.uploadPeriod,
        targetSituation: input.targetSituation,
        commentReactions: input.commentReactions
      },
      selectedTags: selectedTags,
      thumbnailImage: input.thumbnailImage
    };
    const newPlan: SavedPlan = {
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      input,
      analysisInput: payload,
      selectedTags: [...selectedTags],
      analysis,
      planning
    };
    setSavedPlans((prev) => [newPlan, ...prev]);
    showToast('현재 기획안이 브라우저 보관함에 저장되었습니다.');
  };

  const handleLoadSavedPlan = (plan: SavedPlan) => {
    setInput(plan.input);
    if (plan.analysisInput) {
      setAnalysisInput(plan.analysisInput);
      setSelectedTags(plan.analysisInput.selectedTags || plan.selectedTags || []);
    } else {
      setSelectedTags(plan.selectedTags || []);
    }
    setAnalysis(plan.analysis);
    setPlanning(plan.planning);
    setActiveStep(2);
    showToast(`저장된 '${plan.input.title}' 기획안을 불러왔습니다.`);
  };

  const handleDeleteSavedPlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('보관함에서 삭제되었습니다.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/60 font-sans text-stone-800">
      <Header
        onReset={handleReset}
        activeStep={activeStep}
        hasAnalyzed={!!analysis}
        onJumpToStep={handleJumpToStep}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Intro banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-950">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
              YouTube Playlist Benchmarking & Planning System
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-snug">
              잘 되는 플레이리스트의 구조를 읽고,<br className="hidden sm:inline" /> 내 채널만의 콘셉트로 다시 설계해보세요.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              유튜브에서 반응이 좋은 플레이리스트의 <strong>제목 공식, 썸네일 분위기, 타깃 상황</strong>을 분석하여 내 채널에 최적화된 추천 콘셉트 3개와 실전 제작 기획안으로 재구성합니다.
            </p>
          </div>
        </div>

        {/* 1단계: 벤치마킹할 플레이리스트 정보 입력 */}
        <div>
          <Step1InputForm
            input={input}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onChange={handleInputChange}
            onSubmit={handleSubmitAnalysis}
            isAnalyzing={isAnalyzing}
            onShowToast={showToast}
          />
        </div>

        {/* 2단계: 분석 결과 생성 */}
        {analysis && (
          <div ref={step2Ref} className="scroll-mt-24">
            <Step2AnalysisCard
              input={input}
              analysisInput={analysisInput || undefined}
              analysis={analysis}
              onCopy={copyToClipboard}
              onProceedToStep3={() => handleJumpToStep(3)}
            />
          </div>
        )}

        {/* 3단계: 새 플레이리스트 기획안 생성 */}
        {planning && (
          <div ref={step3Ref} className="scroll-mt-24">
            <Step3PlanningCard
              planning={planning}
              onCopy={copyToClipboard}
              onProceedToStep4={() => handleJumpToStep(4)}
            />
          </div>
        )}

        {/* 4단계: 복사 및 저장 기능 */}
        {analysis && planning && (
          <div ref={step4Ref} className="scroll-mt-24">
            <Step4ExportBar
              input={input}
              analysisInput={analysisInput || undefined}
              analysis={analysis}
              planning={planning}
              savedPlans={savedPlans}
              onCopyAll={handleCopyAll}
              onSavePlan={handleSavePlan}
              onReset={handleReset}
              onLoadSavedPlan={handleLoadSavedPlan}
              onDeleteSavedPlan={handleDeleteSavedPlan}
            />
          </div>
        )}
      </main>

      <Footer />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
