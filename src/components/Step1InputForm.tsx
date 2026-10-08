import React, { useState, useRef } from 'react';
import {
  FileText,
  Youtube,
  Clock,
  Calendar,
  Image as ImageIcon,
  Music,
  Target,
  MessageSquare,
  Compass,
  Sparkles,
  BarChart3,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Upload,
  Trash2,
  Bot,
  Check,
  Tag,
  X
} from 'lucide-react';
import { BenchmarkInput } from '../types/playlist';
import { analyzeThumbnailImage } from '../utils/localImageAnalyzer';

interface Step1InputFormProps {
  input: BenchmarkInput;
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onChange: (field: keyof BenchmarkInput, value: any) => void;
  onSubmit: (e: React.FormEvent, mode: 'quick' | 'deep') => void;
  isAnalyzing: boolean;
  onShowToast: (msg: string) => void;
}

// 화면에만 표시되는 추천 태그 목록 (클릭하지 않으면 분석에 절대 포함되지 않음)
const MUSIC_RECOMMEND_TAGS = [
  '로파이',
  '어쿠스틱',
  '시티팝',
  '재즈',
  'R&B',
  '발라드',
  '피아노',
  '앰비언트',
  '클래식'
];

const SITUATION_RECOMMEND_TAGS = [
  '비 오는 날',
  '새벽',
  '카페',
  '공부',
  '수면',
  '드라이브',
  '퇴근길',
  '산책',
  '휴식'
];

const AI_THUMBNAIL_PROMPT = `아래 썸네일을 보고 유튜브 플레이리스트 관점에서 분석해줘.
1. 첫인상
2. 색감과 분위기
3. 어떤 청취 상황을 떠올리게 하는지
4. 클릭을 유도하는 요소
5. 그대로 따라 하면 안 되는 요소
6. 내 채널에 맞게 바꿀 방향
단, 원본을 복제하지 말고 구조만 분석해줘.`;

export const Step1InputForm: React.FC<Step1InputFormProps> = ({
  input,
  selectedTags,
  onToggleTag,
  onChange,
  onSubmit,
  isAnalyzing,
  onShowToast
}) => {
  const [isDeepOpen, setIsDeepOpen] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [showPromptBox, setShowPromptBox] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzingImage(true);
      const analysisInfo = await analyzeThumbnailImage(file);
      onChange('thumbnailImage', analysisInfo);
      onShowToast(`'${file.name}' 썸네일 색감 분석이 완료되었습니다.`);
    } catch {
      onShowToast('이미지 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = () => {
    onChange('thumbnailImage', null);
    onShowToast('썸네일 이미지가 제거되었습니다.');
  };

  const handleCopyAiPrompt = () => {
    navigator.clipboard?.writeText(AI_THUMBNAIL_PROMPT);
    setShowPromptBox(true);
    onShowToast('GPT/Claude용 썸네일 분석 프롬프트가 복사되었습니다!');
  };

  return (
    <section className="bg-white rounded-2xl shadow-xs border border-stone-200/90 overflow-hidden">
      {/* Step Header */}
      <div className="bg-stone-50/70 px-5 sm:px-8 py-5 border-b border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              1단계: 벤치마킹할 플레이리스트 정보 입력
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 pl-8">
            유튜브에서 잘 되는 영상을 직접 보며 관찰한 정보를 워크시트에 적어주세요.
          </p>
        </div>

        <div className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 self-start sm:self-auto flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>사용자 직접 입력 전용 모드</span>
        </div>
      </div>

      {/* 1. 상단 필수 안내 문구 */}
      <div className="mx-5 sm:mx-8 mt-5 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
          시간이 없으면 제목, 썸네일 분위기, 음악 분위기, 내가 만들고 싶은 방향만 입력해도 분석할 수 있어요.<br className="hidden sm:inline" />
          더 정확한 분석을 원하면 세부 정보를 추가해주세요.
        </p>
      </div>

      <form onSubmit={(e) => onSubmit(e, 'quick')} className="p-5 sm:p-8 space-y-7">
        {/* ========================================================= */}
        {/* [빠른 분석 필수 입력] 영역 */}
        {/* ========================================================= */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                빠른 분석 필수 입력
              </h3>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                4개 항목 필수
              </span>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline-block">
              이 4가지만 적어도 바로 기획안이 생성됩니다
            </span>
          </div>

          {/* 1) 벤치마킹 영상 제목 */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-emerald-700" />
                <span>벤치마킹 영상 제목 <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-xs font-normal text-stone-500">유튜브 원본 제목 그대로</span>
            </label>
            <input
              type="text"
              required
              value={input.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="예: 가을에 혼자 방에서 고양이 안고 듣는 kpop 발라드 [Playlist]"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 bg-white transition-all shadow-2xs"
            />
          </div>

          {/* 2) 썸네일 분위기 설명 & 로컬 썸네일 분석 업로드 */}
          <div className="space-y-3 p-4 rounded-xl border border-stone-200/90 bg-stone-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-sm font-semibold text-stone-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span>썸네일 분위기 설명 & 이미지 업로드 <span className="text-rose-500">*</span></span>
              </label>

              <button
                type="button"
                onClick={handleCopyAiPrompt}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs self-start sm:self-auto"
                title="ChatGPT, Claude에 붙여넣을 분석 프롬프트 복사"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold">AI에게 썸네일 분석 요청문 만들기</span>
              </button>
            </div>

            {/* Prompt modal/callout if active */}
            {showPromptBox && (
              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 shadow-xs space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-emerald-950 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    클립보드에 복사된 프롬프트 (ChatGPT / Claude에 이미지와 함께 붙여넣으세요):
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPromptBox(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 whitespace-pre-wrap font-sans text-stone-700 leading-relaxed select-all text-[11px]">
                  {AI_THUMBNAIL_PROMPT}
                </pre>
              </div>
            )}

            {/* 썸네일 이미지 업로드 & 로컬 브라우저 분석 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                id="thumbnail-image-file"
              />

              {!input.thumbnailImage ? (
                <label
                  htmlFor="thumbnail-image-file"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-stone-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isAnalyzingImage ? '브라우저 로컬 분석 중...' : '썸네일 이미지 파일 선택 (로컬 색감 분석)'}</span>
                </label>
              ) : (
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-emerald-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={input.thumbnailImage.previewUrl}
                      alt="Thumbnail Preview"
                      className="w-16 h-10 object-cover rounded-md border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {input.thumbnailImage.fileName}
                      </p>
                      <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: input.thumbnailImage.dominantColorHex }}
                          ></span>
                          {input.thumbnailImage.dominantColorName}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-600">밝기: {input.thumbnailImage.brightness}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-600">무드: {input.thumbnailImage.colorMood}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer self-end sm:self-auto"
                    title="이미지 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-stone-500 pt-0.5 leading-relaxed">
              * <strong>안내:</strong> 이미지는 서버로 전송되지 않습니다. 이미지의 인물, 사물, 장면은 자동으로 판단하지 않습니다. 썸네일에서 보이는 장면과 감정은 직접 적어주세요.
            </p>

            {/* 썸네일 분위기 텍스트 입력 */}
            <textarea
              rows={2}
              value={input.thumbnailDesc}
              onChange={(e) => onChange('thumbnailDesc', e.target.value)}
              placeholder="예: 가을 햇살이 들어오는 창가 방 안에서 고양이를 안고 있는 여자의 뒷모습, 따뜻한 웜톤 필름 감성"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 bg-white resize-none shadow-2xs"
            />
          </div>

          {/* 3) 음악 장르/분위기 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-700" />
                <span>음악 장르 / 분위기 <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-xs font-normal text-stone-500">악기 구성 및 템포</span>
            </label>
            <textarea
              rows={2}
              value={input.musicGenreMood}
              onChange={(e) => onChange('musicGenreMood', e.target.value)}
              placeholder="예: 감성적인 kpop 발라드, 어쿠스틱 피아노와 스트링 선율, 잔잔하고 쓸쓸한 멜로디"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 bg-white resize-none shadow-2xs"
            />

            {/* 추천 태그 목록 (클릭한 것만 초록색으로 켜지고 selectedTags에 포함됨) */}
            <div className="pt-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 font-medium text-stone-600">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>음악 추천 태그 (클릭 시 선택 태그로 분석에 반영):</span>
                </span>
                <span className="text-[11px] text-stone-600">클릭 안 한 태그는 미반영</span>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                {MUSIC_RECOMMEND_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => onToggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer border flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs font-semibold'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400 hover:text-emerald-900 hover:bg-emerald-50/50'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 text-white" /> : <span>+</span>}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4) 내가 만들고 싶은 채널 또는 플레이리스트 방향 */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>내가 만들고 싶은 채널 또는 플레이리스트 방향 <span className="text-rose-500">*</span></span>
              </span>
              <span className="text-xs font-normal text-stone-500">내 채널만의 차별화 지향점</span>
            </label>
            <textarea
              rows={2}
              value={input.userDirection}
              onChange={(e) => onChange('userDirection', e.target.value)}
              placeholder="예: 2030 여성을 위한 가을 감성 발라드와 일상 속 따뜻한 위로를 전하는 플레이리스트 채널"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 bg-white resize-none shadow-2xs"
            />
          </div>

          {/* 현재 선택된 태그 요약 (있는 경우) */}
          {selectedTags.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                선택된 태그 ({selectedTags.length}개 분석에 반영):
              </span>
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-900 font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => onToggleTag(tag)}
                    className="hover:text-rose-600 cursor-pointer"
                    title="태그 선택 해제"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* [깊이 분석 선택 입력] 접이식 영역 */}
        {/* ========================================================= */}
        <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
          <button
            type="button"
            onClick={() => setIsDeepOpen(!isDeepOpen)}
            className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between bg-stone-100/70 hover:bg-stone-100 text-stone-800 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-bold text-stone-900">
                깊이 분석 선택 입력 (선택)
              </span>
              <span className="text-[11px] text-stone-500 hidden sm:inline">
                채널명, 조회수, 길이, 시기, 타깃상황, 댓글 반응
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-lg border border-stone-200 shrink-0">
              <span>{isDeepOpen ? '깊이 분석 항목 접기' : '깊이 분석 항목 열기'}</span>
              {isDeepOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {isDeepOpen && (
            <div className="p-4 sm:p-6 space-y-5 border-t border-stone-200 bg-white animate-in fade-in duration-200">
              <p className="text-xs text-stone-500">
                * 아래 항목들을 입력하면 알고리즘 검색 관점과 타깃 시청자 심리를 더 정밀하게 분석합니다. (미입력 시 '추가 관찰 필요'로 처리됨)
              </p>

              {/* 4-Grid: Channel, Views, Duration, Upload Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>채널명</span>
                  </label>
                  <input
                    type="text"
                    value={input.channelName}
                    onChange={(e) => onChange('channelName', e.target.value)}
                    placeholder="예: 달빛서재"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-stone-500" />
                    <span>조회수 또는 반응</span>
                  </label>
                  <input
                    type="text"
                    value={input.viewsEngagement}
                    onChange={(e) => onChange('viewsEngagement', e.target.value)}
                    placeholder="예: 180만 회"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>영상 길이</span>
                  </label>
                  <input
                    type="text"
                    value={input.duration}
                    onChange={(e) => onChange('duration', e.target.value)}
                    placeholder="예: 1시간 45분"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>업로드 시기</span>
                  </label>
                  <input
                    type="text"
                    value={input.uploadPeriod}
                    onChange={(e) => onChange('uploadPeriod', e.target.value)}
                    placeholder="예: 3개월 전"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-white"
                  />
                </div>
              </div>

              {/* Target Situation */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-700" />
                    <span>타깃 상황</span>
                  </span>
                  <span className="text-xs font-normal text-stone-500">
                    공부, 수면, 카페, 작업, 비 오는 날 등
                  </span>
                </label>
                <input
                  type="text"
                  value={input.targetSituation}
                  onChange={(e) => onChange('targetSituation', e.target.value)}
                  placeholder="예: 가을 저녁, 혼자만의 시간, 방 안에서 쉴 때"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 bg-white"
                />

                {/* 상황 추천 태그 */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1 font-medium text-stone-600">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>상황 추천 태그 (클릭 시 선택 태그로 분석에 반영):</span>
                    </span>
                    <span className="text-[11px] text-stone-600">클릭 안 한 태그는 미반영</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5">
                    {SITUATION_RECOMMEND_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => onToggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer border flex items-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs font-semibold'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400 hover:text-emerald-900 hover:bg-emerald-50/50'
                          }`}
                        >
                          {isSelected ? <Check className="w-3 h-3 text-white" /> : <span>+</span>}
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Comments Reactions */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>댓글에서 보이는 반응</span>
                  </span>
                  <span className="text-xs font-normal text-stone-500">청취자의 감정/이야기</span>
                </label>
                <textarea
                  rows={2}
                  value={input.commentReactions}
                  onChange={(e) => onChange('commentReactions', e.target.value)}
                  placeholder="예: '가을 냄새 물씬 나네요', '고양이 보면서 듣는데 힐링돼요'"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 bg-white resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 분석 버튼 2개: 빠르게 분석하기 & 깊이 분석하기 */}
        {/* ========================================================= */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
          <p className="text-xs text-stone-500 order-2 sm:order-1">
            * 오직 입력된 단어와 클릭한 태그만으로 분석하며, 비어 있는 선택 항목은 '추가 관찰 필요'로 표기됩니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            {/* 버튼 1: 빠르게 분석하기 */}
            <button
              type="button"
              onClick={(e) => onSubmit(e, 'quick')}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>빠르게 분석하기</span>
            </button>

            {/* 버튼 2: 깊이 분석하기 */}
            <button
              type="button"
              onClick={(e) => {
                if (!isDeepOpen) setIsDeepOpen(true);
                onSubmit(e, 'deep');
              }}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-stone-900/10 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>깊이 분석하기</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
