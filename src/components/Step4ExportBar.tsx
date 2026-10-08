import React, { useState } from 'react';
import {
  Copy,
  Download,
  RotateCcw,
  BookmarkPlus,
  Trash2,
  FolderOpen,
  Calendar,
  CheckCircle,
  FileText
} from 'lucide-react';
import { BenchmarkInput, AnalysisResult, PlanningResult, SavedPlan, AnalysisInputPayload } from '../types/playlist';
import { formatFullPlanAsText } from '../services/analyzer';

interface Step4ExportBarProps {
  input: BenchmarkInput;
  analysisInput?: AnalysisInputPayload;
  analysis: AnalysisResult;
  planning: PlanningResult;
  savedPlans: SavedPlan[];
  onCopyAll: () => void;
  onSavePlan: () => void;
  onReset: () => void;
  onLoadSavedPlan: (plan: SavedPlan) => void;
  onDeleteSavedPlan: (id: string) => void;
}

export const Step4ExportBar: React.FC<Step4ExportBarProps> = ({
  input,
  analysisInput,
  analysis,
  planning,
  savedPlans,
  onCopyAll,
  onSavePlan,
  onReset,
  onLoadSavedPlan,
  onDeleteSavedPlan
}) => {
  const [showSavedList, setShowSavedList] = useState(false);

  const handleDownloadTxt = () => {
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
      selectedTags: [],
      thumbnailImage: input.thumbnailImage
    };
    const fullText = formatFullPlanAsText(payload, analysis, planning);
    const sanitizedTitle = (payload.title || '플레이리스트_기획안')
      .replace(/[\\/:*?"<>|]/g, '')
      .slice(0, 25);
    const fileName = `[플리기획안]_${sanitizedTitle}.txt`;

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              4단계: 기획안 내보내기 & 저장
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 pl-8">
            완성된 벤치마킹 분석 및 기획안 전체를 복사하거나 파일로 다운로드하고 새 분석을 시작하세요.
          </p>
        </div>

        {/* Secondary save actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onSavePlan}
            className="text-xs px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-800 font-medium flex items-center gap-1.5 cursor-pointer bg-white"
            title="현재 기획안을 브라우저에 임시 저장"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>기획안 보관</span>
          </button>

          <button
            onClick={() => setShowSavedList(!showSavedList)}
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer bg-stone-50"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>보관함 ({savedPlans.length})</span>
          </button>
        </div>
      </div>

      {/* Main 3 Action Buttons Requested by User */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* 1. 전체 결과 한 번에 복사 */}
        <button
          onClick={onCopyAll}
          className="p-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-900/10 cursor-pointer active:scale-[0.99]"
        >
          <Copy className="w-4 h-4" />
          <span>전체 결과 한 번에 복사</span>
        </button>

        {/* 2. .txt 파일로 저장 */}
        <button
          onClick={handleDownloadTxt}
          className="p-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-stone-900/10 cursor-pointer active:scale-[0.99]"
        >
          <Download className="w-4 h-4" />
          <span>.txt 파일로 저장</span>
        </button>

        {/* 3. 입력 내용 초기화 또는 새 분석 시작 */}
        <button
          onClick={onReset}
          className="p-4 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-semibold text-sm border-2 border-stone-300 hover:border-stone-400 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.99]"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>새 분석 시작 (초기화)</span>
        </button>
      </div>

      {/* Saved plans list drawer */}
      {showSavedList && (
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
              내 기획안 보관함 ({savedPlans.length}개)
            </h3>
            <span className="text-[11px] text-stone-600">브라우저 로컬 저장소</span>
          </div>

          {savedPlans.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-500">
              아직 저장된 기획안이 없습니다. 위의 '기획안 보관' 버튼을 누르면 언제든 다시 불러올 수 있습니다.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-stone-50 hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {plan.input.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span>{plan.input.channelName || '채널명 없음'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(plan.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onLoadSavedPlan(plan)}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-stone-200 hover:border-emerald-500 hover:text-emerald-900 font-medium text-stone-700 cursor-pointer shadow-2xs"
                    >
                      불러오기
                    </button>
                    <button
                      onClick={() => onDeleteSavedPlan(plan.id)}
                      className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
