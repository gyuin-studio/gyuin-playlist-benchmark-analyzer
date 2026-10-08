export interface ThumbnailAnalysisInfo {
  fileName: string;
  previewUrl: string;
  dominantColorHex: string;
  dominantColorName: string;
  brightness: '밝음' | '중간' | '어두움';
  colorMood: '따뜻함' | '차분함' | '선명함' | '부드러움';
  impressionMemo: string;
}

export interface BenchmarkInput {
  title: string;              // 벤치마킹 영상 제목
  channelName: string;        // 채널명
  viewsEngagement: string;    // 조회수 또는 반응 (예: 180만회 / 댓글 3,200개)
  duration: string;           // 영상 길이 (예: 1시간 30분)
  uploadPeriod: string;       // 업로드 시기 (예: 6개월 전 / 가을 시즌)
  thumbnailDesc: string;      // 썸네일 분위기 설명 (예: 비 내리는 창문 밖 흐릿한 네온사인과 김 서린 유리)
  musicGenreMood: string;     // 음악 장르/분위기 (예: 차분한 로파이 힙합, 빈티지 피아노 선율)
  targetSituation: string;    // 타깃 상황 (예: 비 오는 날, 새벽 공부, 카페 작업)
  commentReactions: string;   // 댓글에서 보이는 반응 (예: "밤샘 과제할 때마다 찾는다", "마음이 차분해져요")
  userDirection: string;      // 내가 만들고 싶은 채널 또는 플레이리스트 방향
  thumbnailImage?: ThumbnailAnalysisInfo | null; // 썸네일 이미지 로컬 분석 정보
}

export interface AnalysisInputPayload {
  title: string;              // 현재 제목 입력값
  thumbnailText: string;      // 현재 썸네일 설명 입력값
  musicMood: string;          // 현재 음악 장르/분위기 입력값
  direction: string;          // 현재 만들고 싶은 방향 입력값
  optional: {                 // 현재 깊이 분석 항목 중 실제 입력된 값
    channelName: string;
    viewsEngagement: string;
    duration: string;
    uploadPeriod: string;
    targetSituation: string;
    commentReactions: string;
  };
  selectedTags: string[];     // 사용자가 실제로 클릭해서 선택한 태그만
  thumbnailImage?: ThumbnailAnalysisInfo | null;
}

export interface ExtractedDebugKeywords {
  fromTitle: string[];
  fromThumbnail: string[];
  fromMusic: string[];
  fromDirection: string[];
  selectedTags: string[];
  excludedEmptyFields: string[];
}

export interface AnalysisReasonA {
  titleExpectation: string;    // 제목이 주는 기대감
  viewerSituation: string;     // 시청자가 상상하는 상황
  musicPurpose: string;        // 음악의 사용 목적
  thumbnailVibe: string;       // 썸네일이 주는 분위기
  searchKeywordView: string;   // 검색 키워드 관점
}

export interface TitleFormulaB {
  situationKeywords: string[]; // 상황 키워드
  emotionKeywords: string[];   // 감정 키워드
  genreKeywords: string[];     // 장르 키워드
  purposeKeywords: string[];   // 사용 목적 키워드
  titleFormulaSummary: string; // 제목 구조 요약
}

export interface WarningsC {
  titleWarning: string;            // 제목을 그대로 따라 하지 않기
  thumbnailWarning: string;        // 썸네일 분위기를 그대로 복제하지 않기
  channelConceptWarning: string;   // 채널 콘셉트를 그대로 가져오지 않기
  safeReferenceGuide: string;      // 장르와 감정 구조만 참고하기
}

export interface DifferentiationD {
  structureToAdopt: string;        // 원본에서 참고할 구조
  elementsToChange: string;        // 반드시 바꿔야 할 요소
  newUniqueConcept: string;        // 내 채널에 맞는 새로운 콘셉트
  differentiationKeywords: string[]; // 차별화 키워드 5개
}

export interface AnalysisResult {
  debugKeywords: ExtractedDebugKeywords;
  reasonA: AnalysisReasonA;
  formulaB: TitleFormulaB;
  warningsC: WarningsC;
  differentiationD: DifferentiationD;
}

export interface PlaylistConcept {
  id: string;
  name: string;
  hook: string;
  description: string;
  differentiation: string;
  featuredTitle: string;        // 제목 후보 1개
  musicDirection: string;       // 음악 방향
  thumbnailDirection: string;   // 썸네일 방향
  sunoKeyPrompt: string;        // Suno 프롬프트 핵심 문장
}

export interface TitleCandidate {
  title: string;
  tag: string;
  reason: string;
}

export interface ThumbnailPrompt {
  label: string;
  promptKo: string;
  promptEn: string;
  aspectRatio: string;
  styleAdvice: string;
}

export interface SunoPrompt {
  conceptName: string;
  promptText: string;
  styleTags: string;
  bpmAndMood: string;
  instruments: string;
}

export interface PlanningResult {
  concepts: PlaylistConcept[];
  titleCandidates: TitleCandidate[];
  thumbnailPrompts: ThumbnailPrompt[];
  sunoPrompts: SunoPrompt[];
  youtubeDescription: string;
  pinnedComment: string;
  hashtags: string[];
}

export interface SavedPlan {
  id: string;
  createdAt: string;
  input: BenchmarkInput;
  analysisInput: AnalysisInputPayload;
  selectedTags?: string[];
  analysis: AnalysisResult;
  planning: PlanningResult;
}
