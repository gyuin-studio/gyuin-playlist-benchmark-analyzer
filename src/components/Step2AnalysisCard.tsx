import React from 'react';
import {
  Sparkles,
  Search,
  Eye,
  Disc,
  Image as ImageIcon,
  Copy,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnalysisResult, BenchmarkInput, AnalysisInputPayload } from '../types/playlist';

interface Step2AnalysisCardProps {
  input: BenchmarkInput;
  analysisInput?: AnalysisInputPayload;
  analysis: AnalysisResult;
  onCopy: (text: string, label: string) => void;
  onProceedToStep3: () => void;
}

export const Step2AnalysisCard: React.FC<Step2AnalysisCardProps> = ({
  input,
  analysisInput,
  analysis,
  onCopy,
  onProceedToStep3
}) => {
  const kw = analysis.debugKeywords;
  const currentTitle = analysisInput?.title || input.title;
  const currentThumbnail = analysisInput?.thumbnailText || input.thumbnailDesc;
  const currentMusic = analysisInput?.musicMood || input.musicGenreMood;
  const currentDirection = analysisInput?.direction || input.userDirection;
  const selectedTags = analysisInput?.selectedTags || kw.selectedTags || [];

  return (
    <section className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              2단계: 벤치마킹 구조 분석 결과
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 pl-8">
            입력된 플레이리스트의 성공 메커니즘을 4개 관점(성공 요인, 제목 공식, 복제 금지 요소, 차별화 방향)으로 분해했습니다.
          </p>
        </div>

        <button
          onClick={onProceedToStep3}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-300/60"
        >
          <span>3단계 기획안 바로보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. 디버그 확인용 표시: 이번 분석에 실제로 사용된 단어 확인 박스 */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm sm:text-base font-bold text-emerald-100">
              [이번 분석에 사용된 단어] (검증 확인 박스)
            </h3>
          </div>
          <span className="text-xs text-emerald-300/90 font-medium">
            ✓ 추천 태그나 샘플 데이터 없이 오직 아래 단어들만 분석에 사용되었습니다
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 font-semibold block">• 제목 키워드:</span>
            <span className="text-emerald-50 font-medium break-all text-[13px]">
              {kw.fromTitle.length > 0 ? kw.fromTitle.join(', ') : (currentTitle || '없음')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 font-semibold block">• 썸네일 키워드:</span>
            <span className="text-emerald-50 font-medium break-all text-[13px]">
              {kw.fromThumbnail.length > 0
                ? kw.fromThumbnail.join(', ')
                : (currentThumbnail || (input.thumbnailImage ? input.thumbnailImage.impressionMemo : '없음'))}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 font-semibold block">• 음악 분위기:</span>
            <span className="text-emerald-50 font-medium break-all text-[13px]">
              {kw.fromMusic.length > 0 ? kw.fromMusic.join(', ') : (currentMusic || '없음')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800/60 space-y-1">
            <span className="text-emerald-300 font-semibold block">• 방향 키워드:</span>
            <span className="text-emerald-50 font-medium break-all text-[13px]">
              {kw.fromDirection.length > 0 ? kw.fromDirection.join(', ') : (currentDirection || '없음')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-0.5">
          <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/40 space-y-1">
            <span className="text-emerald-300 font-semibold block">• 선택된 태그:</span>
            <span className="text-emerald-100 font-medium break-all">
              {selectedTags.length > 0 ? selectedTags.join(', ') : '없음 (클릭한 추천 태그 없음)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/40 space-y-1">
            <span className="text-emerald-300 font-semibold block">• 제외된 빈 항목:</span>
            <span className="text-emerald-200/90 font-medium break-all">
              {kw.excludedEmptyFields.length > 0 ? kw.excludedEmptyFields.join(', ') : '없음 (모든 항목 입력됨)'}
            </span>
          </div>
        </div>
      </div>

      {/* A. 이 플레이리스트가 잘 되는 이유 */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                A. 이 플레이리스트가 잘 되는 이유
              </h3>
              <p className="text-xs text-stone-600">
                시청자가 클릭하고 끝까지 청취하게 만드는 심리적/알고리즘적 요인
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onCopy(
                `[A. 이 플레이리스트가 잘 되는 이유]\n1. 제목이 주는 기대감: ${analysis.reasonA.titleExpectation}\n2. 시청자가 상상하는 상황: ${analysis.reasonA.viewerSituation}\n3. 음악의 사용 목적: ${analysis.reasonA.musicPurpose}\n4. 썸네일이 주는 분위기: ${analysis.reasonA.thumbnailVibe}\n5. 검색 키워드 관점: ${analysis.reasonA.searchKeywordView}`,
                'A 영역 전체'
              )
            }
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
            title="A 영역 전체 복사"
          >
            <Copy className="w-3 h-3" />
            <span>A영역 복사</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {/* 1. 제목이 주는 기대감 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  01. 제목 기대감
                </span>
                <button
                  onClick={() => onCopy(analysis.reasonA.titleExpectation, '제목이 주는 기대감')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  title="복사"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {analysis.reasonA.titleExpectation}
              </p>
            </div>
          </div>

          {/* 2. 시청자가 상상하는 상황 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  02. 시청자 상상 상황
                </span>
                <button
                  onClick={() => onCopy(analysis.reasonA.viewerSituation, '시청자가 상상하는 상황')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  title="복사"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {analysis.reasonA.viewerSituation}
              </p>
            </div>
          </div>

          {/* 3. 음악의 사용 목적 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  03. 음악 사용 목적
                </span>
                <button
                  onClick={() => onCopy(analysis.reasonA.musicPurpose, '음악의 사용 목적')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  title="복사"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {analysis.reasonA.musicPurpose}
              </p>
            </div>
          </div>

          {/* 4. 썸네일이 주는 분위기 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/70 flex flex-col justify-between md:col-span-1 lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  04. 썸네일 분위기 연출
                </span>
                <button
                  onClick={() => onCopy(analysis.reasonA.thumbnailVibe, '썸네일 분위기')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  title="복사"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {analysis.reasonA.thumbnailVibe}
              </p>
            </div>
          </div>

          {/* 5. 검색 키워드 관점 */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  05. 검색 키워드 관점
                </span>
                <button
                  onClick={() => onCopy(analysis.reasonA.searchKeywordView, '검색 키워드 관점')}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                  title="복사"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {analysis.reasonA.searchKeywordView}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* B. 제목 공식 분석 */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                B. 제목 공식 분석
              </h3>
              <p className="text-xs text-stone-600">
                유튜브 클릭을 부르는 키워드 블록 분해 및 구조 공식
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onCopy(
                `[B. 제목 공식 분석]\n• 상황 키워드: ${analysis.formulaB.situationKeywords.join(', ')}\n• 감정 키워드: ${analysis.formulaB.emotionKeywords.join(', ')}\n• 장르 키워드: ${analysis.formulaB.genreKeywords.join(', ')}\n• 사용 목적 키워드: ${analysis.formulaB.purposeKeywords.join(', ')}\n• 제목 구조 요약: ${analysis.formulaB.titleFormulaSummary}`,
                'B 영역 전체'
              )
            }
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>B영역 복사</span>
          </button>
        </div>

        {/* Keyword Block Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Situation Keywords */}
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-700" />
                상황 키워드
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysis.formulaB.situationKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-white border border-stone-200 text-stone-800 font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Emotion Keywords */}
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-700" />
                감정 키워드
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysis.formulaB.emotionKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-white border border-stone-200 text-stone-800 font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Genre Keywords */}
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-700" />
                장르 키워드
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysis.formulaB.genreKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-white border border-stone-200 text-stone-800 font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Purpose Keywords */}
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-700" />
                사용 목적 키워드
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {analysis.formulaB.purposeKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-white border border-stone-200 text-stone-800 font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Formula Summary Banner */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-900 block mb-1">
              핵심 제목 구조 요약:
            </span>
            <code className="text-xs sm:text-sm font-semibold text-emerald-950 font-mono">
              {analysis.formulaB.titleFormulaSummary}
            </code>
          </div>
          <button
            onClick={() => onCopy(analysis.formulaB.titleFormulaSummary, '제목 구조 요약')}
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-medium hover:bg-emerald-100/50 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            공식 복사
          </button>
        </div>
      </div>

      {/* C. 따라 하면 안 되는 요소 (주의 경고) */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-amber-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/80">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900 text-base">
                  C. 따라 하면 안 되는 요소
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                  복제 금지 포인트
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                참고할 구조와 바꿔야 할 요소를 분리해서 보세요.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onCopy(
                `[C. 따라 하면 안 되는 요소 (복제 금지 포인트)]\n* 참고할 구조와 바꿔야 할 요소를 분리해서 보세요.\n• 제목 그대로 복제 금지: ${analysis.warningsC.titleWarning}\n• 썸네일 분위기 단순 복제 금지: ${analysis.warningsC.thumbnailWarning}\n• 채널 콘셉트 무단 차용 금지: ${analysis.warningsC.channelConceptWarning}\n• 안전한 참고 가이드: ${analysis.warningsC.safeReferenceGuide}`,
                'C 영역 전체'
              )
            }
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-600 hover:text-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>C영역 복사</span>
          </button>
        </div>

        {/* Guidance tip box */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>기획 팁:</strong> 겉모양을 그대로 베끼면 알고리즘에서 불리해집니다. 시청자가 머무르는 '심리 구조'만 흡수하고, 표현은 내 이야기로 채워주세요.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              제목을 그대로 따라 하지 않기
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {analysis.warningsC.titleWarning}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              썸네일 분위기를 그대로 복제하지 않기
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {analysis.warningsC.thumbnailWarning}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              채널 콘셉트를 그대로 가져오지 않기
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {analysis.warningsC.channelConceptWarning}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              장르와 감정 구조만 참고하기 (안전한 접근법)
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {analysis.warningsC.safeReferenceGuide}
            </p>
          </div>
        </div>
      </div>

      {/* D. 내 채널용 차별화 방향 */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                D. 내 채널용 차별화 방향
              </h3>
              <p className="text-xs text-stone-600">
                구조적 장점은 흡수하고, 내 브랜드만의 고유한 매력을 덧입히는 전략
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onCopy(
                `[D. 내 채널용 차별화 방향]\n• 원본에서 참고할 구조: ${analysis.differentiationD.structureToAdopt}\n• 반드시 바꿔야 할 요소: ${analysis.differentiationD.elementsToChange}\n• 내 채널에 맞는 새로운 콘셉트: ${analysis.differentiationD.newUniqueConcept}\n• 차별화 키워드: ${analysis.differentiationD.differentiationKeywords.join(', ')}`,
                'D 영역 전체'
              )
            }
            className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>D영역 복사</span>
          </button>
        </div>

        {/* Structure vs Change Side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                원본에서 참고할 구조
              </span>
              <button
                onClick={() => onCopy(analysis.differentiationD.structureToAdopt, '참고할 구조')}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {analysis.differentiationD.structureToAdopt}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                반드시 바꿔야 할 요소
              </span>
              <button
                onClick={() => onCopy(analysis.differentiationD.elementsToChange, '바꿔야 할 요소')}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {analysis.differentiationD.elementsToChange}
            </p>
          </div>
        </div>

        {/* New Concept */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              내 채널에 맞는 새로운 콘셉트
            </span>
            <button
              onClick={() => onCopy(analysis.differentiationD.newUniqueConcept, '새로운 콘셉트')}
              className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {analysis.differentiationD.newUniqueConcept}
          </p>
        </div>

        {/* 5 Differentiation Keywords */}
        <div>
          <span className="text-xs font-semibold text-stone-500 block mb-2">
            내 플레이리스트를 위한 핵심 차별화 키워드 5개:
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.differentiationD.differentiationKeywords.map((kw, i) => (
              <span
                key={i}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-emerald-100/70 text-emerald-950 font-medium border border-emerald-200 flex items-center gap-1.5"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
