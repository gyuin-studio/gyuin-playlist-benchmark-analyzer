import React, { useState } from 'react';
import {
  Sparkles,
  Type,
  Image as ImageIcon,
  Music,
  FileText,
  MessageSquare,
  Hash,
  Copy,
  Check,
  ChevronRight,
  Info,
  Disc,
  Compass,
  ArrowRight
} from 'lucide-react';
import { PlanningResult } from '../types/playlist';

interface Step3PlanningCardProps {
  planning: PlanningResult;
  onCopy: (text: string, label: string) => void;
  onProceedToStep4: () => void;
}

export const Step3PlanningCard: React.FC<Step3PlanningCardProps> = ({
  planning,
  onCopy,
  onProceedToStep4
}) => {
  const [detailTab, setDetailTab] = useState<'titles' | 'thumbnails' | 'suno' | 'description' | 'hashtags'>('titles');

  return (
    <section className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              3단계: 내 채널용 새 플레이리스트 기획안
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200">
              핵심 결과
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 pl-8">
            수강생이 즉시 기획과 제작에 돌입할 수 있도록 <strong>3가지 추천 콘셉트</strong>와 실전 제작 자료를 완성했습니다.
          </p>
        </div>

        <button
          onClick={onProceedToStep4}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <span>4단계 저장 & 복사</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Flagship Section: 3 Large Featured Concept Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              ★
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                추천 콘셉트 3개 (우선 활용 기획안)
              </h3>
              <p className="text-xs text-stone-500">
                가장 마음에 드는 콘셉트 하나를 골라 유튜브 채널에 바로 적용해보세요.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              onCopy(
                planning.concepts
                  .map(
                    (c, i) =>
                      `[추천 콘셉트 0${i + 1}: ${c.name}]\n• 제목 후보: ${c.featuredTitle}\n• 음악 방향: ${c.musicDirection}\n• 썸네일 방향: ${c.thumbnailDirection}\n• Suno 핵심 프롬프트: ${c.sunoKeyPrompt}\n• 핵심 훅: ${c.hook}\n• 차별화: ${c.differentiation}`
                  )
                  .join('\n\n'),
                '추천 콘셉트 3개 전체'
              )
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
          >
            <Copy className="w-3 h-3" />
            <span>콘셉트 3개 전체 복사</span>
          </button>
        </div>

        {/* 3 Large Responsive Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {planning.concepts.map((concept, index) => (
            <div
              key={concept.id}
              className="bg-white rounded-2xl border-2 border-emerald-100 hover:border-emerald-600/70 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                {/* 1. 콘셉트 이름 Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 block w-fit mb-1.5">
                      콘셉트 0{index + 1}
                    </span>
                    <h4 className="font-bold text-stone-900 text-base leading-snug">
                      {concept.name}
                    </h4>
                  </div>
                  <button
                    onClick={() =>
                      onCopy(
                        `[${concept.name}]\n- 추천 제목: ${concept.featuredTitle}\n- 음악 방향: ${concept.musicDirection}\n- 썸네일 방향: ${concept.thumbnailDirection}\n- Suno 프롬프트: ${concept.sunoKeyPrompt}`,
                        `콘셉트 0${index + 1} 카드 전체`
                      )
                    }
                    className="text-stone-400 hover:text-emerald-700 p-1.5 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors shrink-0"
                    title="이 카드 내용 복사"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. 제목 후보 1개 */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <Type className="w-3.5 h-3.5 text-emerald-700" />
                      제목 후보
                    </span>
                    <button
                      onClick={() => onCopy(concept.featuredTitle, '제목 후보')}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                      title="제목 복사"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                    {concept.featuredTitle}
                  </p>
                </div>

                {/* 3. 음악 방향 */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-stone-700">
                    <Music className="w-3.5 h-3.5 text-emerald-700" />
                    <span>음악 방향</span>
                  </div>
                  <p className="text-stone-600 bg-stone-50/70 p-2.5 rounded-lg border border-stone-200/60 leading-relaxed">
                    {concept.musicDirection}
                  </p>
                </div>

                {/* 4. 썸네일 방향 */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-stone-700">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>썸네일 방향</span>
                  </div>
                  <p className="text-stone-600 bg-stone-50/70 p-2.5 rounded-lg border border-stone-200/60 leading-relaxed">
                    {concept.thumbnailDirection}
                  </p>
                </div>

                {/* 5. Suno 프롬프트 핵심 문장 */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-stone-700">
                    <span className="flex items-center gap-1">
                      <Disc className="w-3.5 h-3.5 text-emerald-700" />
                      Suno 프롬프트 핵심 문장
                    </span>
                    <button
                      onClick={() => onCopy(concept.sunoKeyPrompt, 'Suno 프롬프트 핵심 문장')}
                      className="text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer text-[11px] flex items-center gap-0.5"
                    >
                      <Copy className="w-3 h-3" /> 복사
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-stone-800 bg-stone-100 p-2.5 rounded-lg border border-stone-200 leading-relaxed select-all">
                    {concept.sunoKeyPrompt}
                  </p>
                </div>
              </div>

              {/* Bottom Differentiation Footer */}
              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-start gap-1">
                <span className="font-semibold text-emerald-900 shrink-0">차별화:</span>
                <span>{concept.differentiation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Production Assets Tabs */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              상세 제작 자료 서랍
            </h3>
            <p className="text-xs text-stone-500">
              선택한 콘셉트에 맞춰 제목 7개, 생성형 AI 프롬프트, 설명란과 태그를 조합해보세요.
            </p>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setDetailTab('titles')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                detailTab === 'titles'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              제목 후보 (7)
            </button>
            <button
              onClick={() => setDetailTab('thumbnails')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                detailTab === 'thumbnails'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              썸네일 프롬프트 (3)
            </button>
            <button
              onClick={() => setDetailTab('suno')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                detailTab === 'suno'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              Suno 프롬프트 (3)
            </button>
            <button
              onClick={() => setDetailTab('description')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                detailTab === 'description'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              설명란 & 고정 댓글
            </button>
            <button
              onClick={() => setDetailTab('hashtags')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                detailTab === 'hashtags'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              해시태그 (10)
            </button>
          </div>
        </div>

        {/* Tab 1: Titles 7 */}
        {detailTab === 'titles' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>클릭률을 극대화하는 7가지 제목 바리에이션입니다.</span>
              <button
                onClick={() =>
                  onCopy(
                    planning.titleCandidates.map((t, i) => `${i + 1}. [${t.tag}] ${t.title}`).join('\n'),
                    '제목 7개 전체'
                  )
                }
                className="text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> 제목 7개 모두 복사
              </button>
            </div>
            <div className="space-y-2">
              {planning.titleCandidates.map((candidate, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600 shrink-0">
                      {candidate.tag}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                      {candidate.title}
                    </p>
                  </div>
                  <button
                    onClick={() => onCopy(candidate.title, `제목 ${idx + 1}`)}
                    className="text-xs px-2.5 py-1 rounded-md bg-white border border-stone-200 hover:border-emerald-400 text-stone-700 hover:text-emerald-900 shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> 복사
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Thumbnail Prompts */}
        {detailTab === 'thumbnails' && (
          <div className="space-y-4">
            {planning.thumbnailPrompts.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>{item.label} (16:9 규격)</span>
                  <button
                    onClick={() => onCopy(item.promptEn, `영문 프롬프트 ${idx + 1}`)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Midjourney 영문 복사
                  </button>
                </div>
                <p className="text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200/70">
                  <span className="font-semibold text-stone-500 block mb-0.5">한글 묘사:</span>
                  {item.promptKo}
                </p>
                <p className="font-mono text-stone-600 bg-stone-100 p-2.5 rounded-lg border border-stone-200/70 select-all">
                  <span className="font-sans font-semibold text-stone-500 block mb-0.5">영문 프롬프트:</span>
                  {item.promptEn}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Suno Prompts */}
        {detailTab === 'suno' && (
          <div className="space-y-4">
            {planning.sunoPrompts.map((suno, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span>{suno.conceptName}</span>
                  <button
                    onClick={() => onCopy(suno.promptText, `Suno 프롬프트 ${idx + 1}`)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Suno 프롬프트 복사
                  </button>
                </div>
                <p className="font-mono text-stone-800 bg-white p-2.5 rounded-lg border border-stone-200 select-all">
                  {suno.promptText}
                </p>
                <div className="flex flex-wrap gap-2 text-stone-500 pt-1">
                  <span><strong>태그:</strong> {suno.styleTags}</span>
                  <span>•</span>
                  <span><strong>템포:</strong> {suno.bpmAndMood}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Description & Pinned comment */}
        {detailTab === 'description' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span>유튜브 영상 설명란 초안 (타임라인 서식 포함)</span>
                <button
                  onClick={() => onCopy(planning.youtubeDescription, '설명란 초안')}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> 설명란 복사
                </button>
              </div>
              <pre className="text-xs text-stone-800 bg-stone-50 p-3.5 rounded-xl border border-stone-200 whitespace-pre-wrap font-sans leading-relaxed">
                {planning.youtubeDescription}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                <span>고정 댓글 문구 (시청자 소통 유도)</span>
                <button
                  onClick={() => onCopy(planning.pinnedComment, '고정 댓글 문구')}
                  className="text-emerald-700 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> 댓글 문구 복사
                </button>
              </div>
              <pre className="text-xs text-stone-800 bg-stone-50 p-3.5 rounded-xl border border-stone-200 whitespace-pre-wrap font-sans leading-relaxed">
                {planning.pinnedComment}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 5: Hashtags */}
        {detailTab === 'hashtags' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>클릭하여 태그를 개별 복사하거나 전체를 한 번에 복사하세요.</span>
              <button
                onClick={() => onCopy(planning.hashtags.join(' '), '해시태그 10개')}
                className="text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> 10개 모두 복사
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {planning.hashtags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => onCopy(tag, tag)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-400 text-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{tag}</span>
                  <Copy className="w-3 h-3 opacity-40 hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Requirement 6: Mandatory Bottom Guidance Notice */}
      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
        <p className="text-xs sm:text-sm font-semibold text-emerald-950">
          “이 결과는 정답이 아니라, 내 채널 방향에 맞게 다시 다듬기 위한 기획 초안입니다.”
        </p>
      </div>
    </section>
  );
};
