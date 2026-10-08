import {
  AnalysisInputPayload,
  AnalysisResult,
  PlanningResult,
  PlaylistConcept,
  TitleCandidate,
  ThumbnailPrompt,
  SunoPrompt,
  ExtractedDebugKeywords
} from '../types/playlist';

// 조사, 어미, 특수문자 정리를 위한 한국어 불용어 목록
const STOP_WORDS = new Set([
  '때', '것', '이', '그', '저', '수', '등', '들', '및', '위한', '하는', '듣는',
  '모음', '플리', '플레이리스트', 'playlist', '곡', '노래', '음악', 'bgm',
  '에서', '으로', '로', '에게', '과', '와', '을', '를', '의', '에', '은', '는', '이', '가',
  '좋은', '추천', '풀버전', '연속재생'
]);

function extractPureWords(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  const cleaned = text
    .replace(/\[.*?\]|\(.*?\)/g, ' ')
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/g, ' ')
    .trim();
  if (!cleaned) return [];

  const rawWords = cleaned
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 1 && !STOP_WORDS.has(w.toLowerCase()));
  return Array.from(new Set(rawWords));
}

function cleanTag(str: string): string {
  if (!str) return '';
  return str.replace(/[\s\W]+/g, '').slice(0, 15);
}

// 오직 사용자가 입력한 현재 값에서만 키워드를 분리 추출
export function extractKeywordsFromPayload(input: AnalysisInputPayload): ExtractedDebugKeywords {
  const fromTitle = extractPureWords(input.title);
  const fromThumbnail = extractPureWords(input.thumbnailText);
  const fromMusic = extractPureWords(input.musicMood);
  const fromDirection = extractPureWords(input.direction);
  const selectedTags = Array.isArray(input.selectedTags) ? [...input.selectedTags] : [];

  const excludedEmptyFields: string[] = [];
  if (!input.title?.trim()) excludedEmptyFields.push('제목');
  if (!input.thumbnailText?.trim() && !input.thumbnailImage) excludedEmptyFields.push('썸네일 설명');
  if (!input.musicMood?.trim()) excludedEmptyFields.push('음악 분위기');
  if (!input.direction?.trim()) excludedEmptyFields.push('만들고 싶은 방향');
  if (!input.optional?.channelName?.trim()) excludedEmptyFields.push('채널명');
  if (!input.optional?.viewsEngagement?.trim()) excludedEmptyFields.push('조회수/반응');
  if (!input.optional?.duration?.trim()) excludedEmptyFields.push('영상 길이');
  if (!input.optional?.uploadPeriod?.trim()) excludedEmptyFields.push('업로드 시기');
  if (!input.optional?.targetSituation?.trim()) excludedEmptyFields.push('타깃 상황');
  if (!input.optional?.commentReactions?.trim()) excludedEmptyFields.push('댓글 반응');
  if (selectedTags.length === 0) excludedEmptyFields.push('클릭 선택 태그 없음');

  return {
    fromTitle,
    fromThumbnail,
    fromMusic,
    fromDirection,
    selectedTags,
    excludedEmptyFields
  };
}

// 2단계 분석 결과 생성 함수 (100% analysisInput만 참조)
export function generateAnalysis(input: AnalysisInputPayload): AnalysisResult {
  const debugKeywords = extractKeywordsFromPayload(input);

  const hasTitle = Boolean(input.title?.trim());
  const hasThumbnail = Boolean(input.thumbnailText?.trim() || input.thumbnailImage);
  const hasMusic = Boolean(input.musicMood?.trim());
  const hasDirection = Boolean(input.direction?.trim());
  const hasSituation = Boolean(input.optional?.targetSituation?.trim());
  const hasChannel = Boolean(input.optional?.channelName?.trim());

  // A. 이 플레이리스트가 잘 되는 이유 (입력된 단어만으로 조합)
  const titleKeywordsStr = debugKeywords.fromTitle.join(', ');
  const titleExpectation = hasTitle
    ? `제목에 사용된 단어('${titleKeywordsStr || input.title}')가 시청자에게 어떤 감정과 장면에 도달할지 1초 만에 명확히 약속하고 있습니다.`
    : `추가 관찰 필요 (제목 미입력)`;

  const viewerSituation = hasSituation
    ? `시청자가 직접 입력된 상황('${input.optional.targetSituation}')에 머물며 힐링하고자 하는 심리를 직접 겨냥합니다.`
    : (input.selectedTags.length > 0
      ? `선택된 태그('${input.selectedTags.join(', ')}')와 관련된 순간에 시청자가 머물도록 유도합니다.`
      : `추가 관찰 필요 (타깃 상황 미입력)`);

  const musicPurpose = hasMusic
    ? `입력된 음악 스타일('${input.musicMood}')을 바탕으로 시청자의 일상 흐름을 방해하지 않는 안정적인 배경 BGM 역할을 수행합니다.`
    : `추가 관찰 필요 (음악 분위기 미입력)`;

  const thumbnailVibe = input.thumbnailImage
    ? `로컬 썸네일 분석 [${input.thumbnailImage.brightness} 밝기 / ${input.thumbnailImage.colorMood} 무드의 ${input.thumbnailImage.dominantColorName}] 톤과 설명('${input.thumbnailText || '시각 컷'}')이 청취 기대를 극대화합니다.`
    : hasThumbnail
    ? `입력된 썸네일 분위기('${input.thumbnailText}')의 시각적 요소가 청각적 기대감을 즉각 전달합니다.`
    : `추가 관찰 필요 (썸네일 설명 미입력)`;

  const searchKeywordView = debugKeywords.fromTitle.length > 0
    ? `검색자가 입력할 만한 핵심 단어('${debugKeywords.fromTitle.slice(0, 4).join(', ')}')가 자연스럽게 포함되어 검색 및 추천 유입을 유도합니다.`
    : `추가 관찰 필요 (검색 키워드 미입력)`;

  const reasonA = {
    titleExpectation,
    viewerSituation,
    musicPurpose,
    thumbnailVibe,
    searchKeywordView
  };

  // B. 제목 공식 분석 (실제 입력값에서 추출된 단어만 배치)
  const situationKeywords = hasSituation
    ? extractPureWords(input.optional.targetSituation)
    : (input.selectedTags.length > 0 ? [...input.selectedTags] : ['추가 관찰 필요']);

  const emotionKeywords = (debugKeywords.fromThumbnail.length > 0 || debugKeywords.fromDirection.length > 0)
    ? Array.from(new Set([...debugKeywords.fromThumbnail, ...debugKeywords.fromDirection])).slice(0, 3)
    : ['추가 관찰 필요'];

  const genreKeywords = hasMusic
    ? (debugKeywords.fromMusic.length > 0 ? debugKeywords.fromMusic.slice(0, 3) : [input.musicMood])
    : ['추가 관찰 필요'];

  const purposeKeywords = (input.optional?.commentReactions?.trim() || input.optional?.viewsEngagement?.trim())
    ? extractPureWords(`${input.optional.commentReactions || ''} ${input.optional.viewsEngagement || ''}`).slice(0, 3)
    : ['추가 관찰 필요'];

  const sitLabel = situationKeywords[0] !== '추가 관찰 필요' ? situationKeywords[0] : '상황(추가 관찰 필요)';
  const emoLabel = emotionKeywords[0] !== '추가 관찰 필요' ? emotionKeywords[0] : '감정(추가 관찰 필요)';
  const genreLabel = genreKeywords[0] !== '추가 관찰 필요' ? genreKeywords[0] : '음악(추가 관찰 필요)';

  const formulaB = {
    situationKeywords,
    emotionKeywords,
    genreKeywords,
    purposeKeywords,
    titleFormulaSummary: `[${sitLabel}] + [${emoLabel}] + [${genreLabel}] + [Playlist]`
  };

  // C. 따라 하면 안 되는 요소 (복제 금지 포인트)
  const warningsC = {
    titleWarning: hasTitle
      ? `원본 제목('${input.title}')의 어휘와 어순을 그대로 베끼면 원본의 충성도 데이터에 밀려 카피캣으로 분류됩니다.`
      : `원본 제목의 구조를 그대로 복제하지 마세요. (추가 관찰 필요)`,
    thumbnailWarning: hasThumbnail
      ? `원본 썸네일('${input.thumbnailText || '시각 컷'}')의 구도를 복제하지 말고, 내 브랜드만의 시각적 톤앤매너를 만드세요.`
      : `원본 썸네일 구도를 단순 복제하지 마세요. (추가 관찰 필요)`,
    channelConceptWarning: hasChannel
      ? `'${input.optional.channelName}'의 브랜딩을 모방하면 하위 호환으로 인식됩니다. 1명의 청취자 페르소나를 새로 정의하세요.`
      : `원본 채널의 콘셉트를 그대로 복제하지 마세요. (추가 관찰 필요)`,
    safeReferenceGuide: `“복제 금지 포인트” - “참고할 구조와 바꿔야 할 요소를 분리해서 보세요.” 원본에서는 '시청자가 반응한 심리적 타이밍'과 '곡 간의 흐름'이라는 뼈대만 참고하고, 소재와 단어는 내 이야기로 새로 채우세요.`
  };

  // D. 내 채널용 차별화 방향
  const structureToAdopt = `원본의 '상황 연상형 제목 공식'과 안정적인 톤앤매너 구조를 계승해 긴 체류 시간을 확보합니다.`;
  const elementsToChange = hasDirection
    ? `원본의 표현 대신 내가 만들고 싶은 '${input.direction}' 방향에 맞추어 독창적인 페르소나로 전면 교체합니다.`
    : `원본 텍스트를 그대로 따르지 않고, 내 채널만의 명확한 타깃과 사운드로 교체합니다. (채널 방향 추가 관찰 필요)`;

  const newUniqueConcept = hasDirection
    ? `'${input.direction}'을 중심 축으로 삼아, 단순 음악 나열을 넘어 청취자가 댓글로 머무는 커뮤니티 공간을 형성합니다.`
    : `단순 배경음악을 넘어 특정 감정을 대변하는 나만의 큐레이션 채널로 포지셔닝합니다.`;

  const differentiationKeywords: string[] = [];
  if (hasDirection) differentiationKeywords.push(`${input.direction.slice(0, 10)} 중심`);
  if (hasMusic) differentiationKeywords.push(`${input.musicMood} 특화`);
  if (debugKeywords.fromTitle.length > 0) differentiationKeywords.push(`${debugKeywords.fromTitle[0]} 재해석`);
  if (input.selectedTags.length > 0) differentiationKeywords.push(`${input.selectedTags[0]} 몰입`);
  differentiationKeywords.push('독창적 브랜딩', '체류시간 최적화');

  const differentiationD = {
    structureToAdopt,
    elementsToChange,
    newUniqueConcept,
    differentiationKeywords: differentiationKeywords.slice(0, 5)
  };

  return {
    debugKeywords,
    reasonA,
    formulaB,
    warningsC,
    differentiationD
  };
}

// 3단계 기획안 생성 함수 (오직 analysisInput에서 추출된 단어로만 문장 조립)
export function generatePlanning(input: AnalysisInputPayload, analysis: AnalysisResult): PlanningResult {
  const userGenre = input.musicMood.trim() || '음악';
  const userDirection = input.direction.trim() || '나만의 플레이리스트';
  const userThumbnail = input.thumbnailText.trim() || (input.thumbnailImage ? `${input.thumbnailImage.dominantColorName} 톤의 비주얼` : '미니멀 감성 컷');
  const userSituation = input.optional?.targetSituation?.trim() || (input.selectedTags.length > 0 ? input.selectedTags.join(', ') : '');

  // 추천 콘셉트 3개 (오직 사용자 입력 단어로만 서술)
  const concepts: PlaylistConcept[] = [
    {
      id: 'concept-1',
      name: `1. 직관 몰입형 (${userDirection.slice(0, 15)})`,
      hook: `'${userDirection}' 방향에 맞춘 '${userGenre}' 중심 몰입 큐레이션`,
      description: `${userDirection}에 초점을 맞추어 청취자가 편안하게 머물 수 있도록 ${userGenre} 위주로 정돈된 기획입니다.`,
      differentiation: `자극적인 요소를 배제하고 ${userGenre} 본연의 질감을 살려 연속 재생 유지`,
      featuredTitle: `${userSituation ? userSituation + ', ' : ''}${userDirection}을 위한 ${userGenre} [Playlist]`,
      musicDirection: `${userGenre} 중심의 균일하고 편안한 선곡 흐름`,
      thumbnailDirection: `${userThumbnail} 느낌의 정돈된 시선 집중 구도`,
      sunoKeyPrompt: `Instrumental ${userGenre}, calm tempo, reflective mood, clear sound, suitable for ${userDirection}`
    },
    {
      id: 'concept-2',
      name: `2. 서사 공감형 (${userGenre} 감성)`,
      hook: `청취자의 공감을 이끌어내는 '${userDirection}' 스토리텔링`,
      description: `단순한 음악 모음을 넘어, '${userDirection}'의 지향점을 바탕으로 ${userGenre}의 깊은 감성을 전합니다.`,
      differentiation: `댓글 창에 청취자들이 자신의 하루를 공유하도록 유도하는 감성 아지트 브랜딩`,
      featuredTitle: `${userGenre}와 함께하는 순간, ${userDirection}`,
      musicDirection: `감정선의 기승전결이 있는 ${userGenre} 중심 선곡`,
      thumbnailDirection: `${userThumbnail}의 분위기를 살린 감성적 오브제 및 여운 있는 구도`,
      sunoKeyPrompt: `Emotional ${userGenre}, melodic acoustic progression, warm texture, inspired by ${userDirection}`
    },
    {
      id: 'concept-3',
      name: `3. 데일리 루틴형 (${userSituation ? userSituation + ' 루틴' : userDirection.slice(0, 15)})`,
      hook: `반복 청취율을 높이는 '${userGenre}' 일상 배경음악 기획`,
      description: `${userSituation ? userSituation + ' 상황에서 ' : ''}${userDirection}의 의도를 담아 매일 찾게 만드는 큐레이션입니다.`,
      differentiation: `방해받지 않는 일관된 사운드로 특정 일과나 루틴에 자연스럽게 스며드는 포지셔닝`,
      featuredTitle: `${userSituation ? userSituation + '에 듣는 ' : ''}${userGenre} 모음 [연속재생]`,
      musicDirection: `튀지 않고 차분함을 지키는 ${userGenre} 트랙 위주`,
      thumbnailDirection: `${userThumbnail} 느낌의 깔끔하고 차분한 비주얼 연출`,
      sunoKeyPrompt: `Background instrumental ${userGenre}, steady pacing, minimal variation, gentle atmosphere`
    }
  ];

  // 유튜브 제목 후보 7개 (오직 사용자 입력 단어만 결합)
  const titleCandidates: TitleCandidate[] = [
    {
      title: `${userSituation ? userSituation + ', ' : ''}${userDirection}을 위한 ${userGenre} [Playlist]`,
      tag: '직관 공감형',
      reason: '타깃 방향과 음악 장르를 명확하게 제시하여 클릭을 유도합니다.'
    },
    {
      title: `${userGenre}와 함께하는 시간 (${userDirection})`,
      tag: '감정 몰입형',
      reason: '음악과의 교감을 강조하여 진정성 있는 청취를 유도합니다.'
    },
    {
      title: `${userDirection}에 어울리는 조용한 ${userGenre}`,
      tag: '위로 서사형',
      reason: '시청자에게 편안한 휴식을 약속하여 체류 시간을 늘립니다.'
    },
    {
      title: `${userSituation ? userSituation + '에서 ' : ''}딴생각 없이 듣는 ${userGenre}`,
      tag: '목적 해결형',
      reason: '집중과 힐링이라는 명확한 청취 목적을 충족시킵니다.'
    },
    {
      title: `오롯이 나에게 집중하는 ${userGenre} [연속재생]`,
      tag: '루틴 반복형',
      reason: '방해 없이 연속으로 듣고 싶어 하는 시청자 니즈를 저격합니다.'
    },
    {
      title: `${userDirection}의 분위기를 담은 ${userGenre} 큐레이션`,
      tag: '브랜딩형',
      reason: '채널 고유의 방향성을 제목 전면에 내세워 고정 팬층을 확보합니다.'
    },
    {
      title: `${userSituation ? userSituation + ', ' : ''}${userGenre} 플레이리스트`,
      tag: '심플 검색형',
      reason: '군더더기 없는 검색 키워드 조합으로 알고리즘 유입을 돕습니다.'
    }
  ];

  // 썸네일 이미지 프롬프트 3개 (오직 사용자 썸네일 설명 / 방향 기반)
  const thumbnailPrompts: ThumbnailPrompt[] = [
    {
      label: '스타일 1: 시네마틱 실사 연출',
      promptKo: `${userThumbnail}, ${userDirection} 분위기, 16:9 와이드 비율, 은은한 자연광 조명, 감성적인 톤앤매너`,
      promptEn: `Cinematic composition of "${userThumbnail}", inspired by "${userDirection}", soft ambient lighting, clean aesthetic, 16:9 aspect ratio --ar 16:9`,
      aspectRatio: '16:9',
      styleAdvice: '과도한 텍스트보다는 장면 자체의 여백과 톤이 음악 청취를 방해하지 않습니다.'
    },
    {
      label: '스타일 2: 서정적 일러스트',
      promptKo: `${userThumbnail}의 정취가 담긴 2D 일러스트, ${userDirection} 테마, 편안한 색감, 16:9 와이드 비율`,
      promptEn: `Emotional 2D digital illustration reflecting "${userThumbnail}", gentle palette, inspiring "${userDirection}", 16:9 aspect ratio --ar 16:9`,
      aspectRatio: '16:9',
      styleAdvice: '인물의 표정을 너무 또렷하게 그리기보다 실루엣이나 풍경 위주가 감상 몰입에 좋습니다.'
    },
    {
      label: '스타일 3: 미니멀 오브제 클로즈업',
      promptKo: `${userThumbnail} 및 ${userGenre}의 감성을 대변하는 미니멀 오브제 클로즈업, 정돈된 배경, 16:9 비율`,
      promptEn: `Minimal aesthetic close-up shot inspired by "${userThumbnail}" and "${userGenre}", warm lighting, clean depth of field, 16:9 aspect ratio --ar 16:9`,
      aspectRatio: '16:9',
      styleAdvice: '정돈된 공간이나 오브제 하나에 초점을 맞추어 단정하고 고급스러운 인상을 줍니다.'
    }
  ];

  // Suno AI 음악 프롬프트 3개 (오직 사용자 장르 / 방향 기반)
  const sunoPrompts: SunoPrompt[] = [
    {
      conceptName: `트랙 1: ${userDirection.slice(0, 15)} 맞춤 연주곡`,
      promptText: `Instrumental ${userGenre}, calm tempo, suitable for ${userDirection}, warm mix`,
      styleTags: `${userGenre}, Instrumental`,
      bpmAndMood: `차분하고 안정된 템포 / 편안한 무드`,
      instruments: `${userGenre} 주요 악기 편성`
    },
    {
      conceptName: `트랙 2: 서정적 멜로디 트랙`,
      promptText: `Emotional ${userGenre}, gentle pacing, reflective texture, inspired by ${userDirection}`,
      styleTags: `${userGenre}, Emotional`,
      bpmAndMood: `감성적인 미디엄 템포 / 깊은 여운`,
      instruments: `${userGenre} 기반 사운드`
    },
    {
      conceptName: `트랙 3: 잔잔한 배경음악 트랙`,
      promptText: `Background ${userGenre}, steady rhythm, peaceful flow, seamless listening`,
      styleTags: `${userGenre}, Ambient, Chill`,
      bpmAndMood: `느린 템포 / 반복 청취에 적합한 구성`,
      instruments: `튀지 않는 배경 반주 편성`
    }
  ];

  // 유튜브 설명란 초안
  const youtubeDescription = `[ 🎧 Playlist Story ]
${userDirection}의 분위기를 담아
${userGenre} 음악들을 정성스럽게 선곡했습니다.

${userSituation ? userSituation + '의 시간에 ' : ''}잠시 마음을 내려놓고 편안하게 머물다 가시길 바랍니다.
오늘도 함께해 주셔서 진심으로 감사드립니다.

ㅡ
[ ⏱️ Tracklist & Timestamps ]
00:00 01. 첫 번째 트랙 제목 (Track 01)
03:15 02. 두 번째 트랙 제목 (Track 02)
06:40 03. 세 번째 트랙 제목 (Track 03)
10:05 04. 네 번째 트랙 제목 (Track 04)

ㅡ
[ 💡 안내 사항 ]
• 본 플레이리스트는 편안한 청취를 위해 광고를 최소화하였습니다.
• 따뜻한 댓글과 구독은 다음 플레이리스트 제작에 큰 힘이 됩니다.`;

  // 고정 댓글 문구
  const pinnedComment = `오늘도 찾아와 주신 모든 분들께 감사드립니다 🌿

${userSituation ? userSituation + '의 ' : ''}순간에 들으시면서 가장 마음에 닿았던 트랙이나,
소소한 일상의 이야기를 댓글로 편하게 들려주세요.
남겨주시는 모든 댓글은 소중히 읽겠습니다 ☕️`;

  // 해시태그 10개 (오직 사용자가 입력한 단어와 클릭한 태그만)
  const userTagList: string[] = ['#플레이리스트'];

  // 1) 실제로 클릭한 선택 태그
  input.selectedTags.forEach(t => {
    const c = cleanTag(t);
    if (c) userTagList.push(`#${c}`);
  });

  // 2) 음악 단어
  const musicTag = cleanTag(userGenre);
  if (musicTag) userTagList.push(`#${musicTag}`);

  // 3) 방향 단어
  const dirTag = cleanTag(userDirection);
  if (dirTag) userTagList.push(`#${dirTag}`);

  // 4) 상황 단어
  if (userSituation) {
    const sitTag = cleanTag(userSituation);
    if (sitTag) userTagList.push(`#${sitTag}`);
  }

  // 5) 제목 키워드
  analysis.debugKeywords.fromTitle.slice(0, 3).forEach(w => {
    const c = cleanTag(w);
    if (c) userTagList.push(`#${c}`);
  });

  // 6) 중립 일반 태그로 10개 채움 (임의의 특정 장르/상황 키워드 절대 배제)
  const neutralFillers = ['#음악추천', '#추천곡', '#BGM', '#감성음악', '#데일리플리', '#음악'];
  for (const filler of neutralFillers) {
    if (userTagList.length >= 10) break;
    if (!userTagList.includes(filler)) userTagList.push(filler);
  }

  const hashtags = Array.from(new Set(userTagList)).filter(t => t.length > 1).slice(0, 10);

  return {
    concepts,
    titleCandidates,
    thumbnailPrompts,
    sunoPrompts,
    youtubeDescription,
    pinnedComment,
    hashtags
  };
}

// 전체 결과를 텍스트 형식으로 내보내는 함수
export function formatFullPlanAsText(input: AnalysisInputPayload, analysis: AnalysisResult, planning: PlanningResult): string {
  const dateStr = new Date().toLocaleDateString('ko-KR');
  const kw = analysis.debugKeywords;

  return `================================================================================
규인 플리 벤치마킹 분석기 - 플레이리스트 기획 리포트
생성일자: ${dateStr}
================================================================================

[ 이번 결과에 실제로 사용된 키워드 (검증 박스) ]
• 제목 키워드: ${kw.fromTitle.join(', ') || input.title || '없음'}
• 썸네일 키워드: ${kw.fromThumbnail.join(', ') || input.thumbnailText || (input.thumbnailImage ? input.thumbnailImage.dominantColorName : '없음')}
• 음악 분위기: ${kw.fromMusic.join(', ') || input.musicMood || '없음'}
• 방향 키워드: ${kw.fromDirection.join(', ') || input.direction || '없음'}
• 선택된 태그: ${kw.selectedTags.length > 0 ? kw.selectedTags.join(', ') : '없음'}
• 제외된 빈 항목: ${kw.excludedEmptyFields.length > 0 ? kw.excludedEmptyFields.join(', ') : '없음'}

--------------------------------------------------------------------------------
[ 1단계: 벤치마킹 원본 입력 데이터 요약 ]
• 벤치마킹 영상 제목: ${input.title || '추가 관찰 필요'}
• 썸네일 분위기 설명: ${input.thumbnailText || '추가 관찰 필요'}
• 음악 장르 / 분위기: ${input.musicMood || '추가 관찰 필요'}
• 내가 만들고 싶은 채널 방향: ${input.direction || '추가 관찰 필요'}
• 채널명: ${input.optional?.channelName || '추가 관찰 필요'}
• 조회수 / 반응: ${input.optional?.viewsEngagement || '추가 관찰 필요'}
• 영상 길이: ${input.optional?.duration || '추가 관찰 필요'}
• 업로드 시기: ${input.optional?.uploadPeriod || '추가 관찰 필요'}
• 타깃 상황: ${input.optional?.targetSituation || '추가 관찰 필요'}
• 댓글 반응: ${input.optional?.commentReactions || '추가 관찰 필요'}

--------------------------------------------------------------------------------
[ 2단계: 분석 결과 (성공 구조 분석) ]
--------------------------------------------------------------------------------

A. 이 플레이리스트가 잘 되는 이유
1) 제목이 주는 기대감:
   ${analysis.reasonA.titleExpectation}
2) 시청자가 상상하는 상황:
   ${analysis.reasonA.viewerSituation}
3) 음악의 사용 목적:
   ${analysis.reasonA.musicPurpose}
4) 썸네일이 주는 분위기:
   ${analysis.reasonA.thumbnailVibe}
5) 검색 키워드 관점:
   ${analysis.reasonA.searchKeywordView}

B. 제목 공식 분석
• 상황 키워드: ${analysis.formulaB.situationKeywords.join(', ')}
• 감정 키워드: ${analysis.formulaB.emotionKeywords.join(', ')}
• 장르 키워드: ${analysis.formulaB.genreKeywords.join(', ')}
• 사용 목적 키워드: ${analysis.formulaB.purposeKeywords.join(', ')}
• 제목 구조 요약: ${analysis.formulaB.titleFormulaSummary}

C. 따라 하면 안 되는 요소 (복제 금지 포인트)
* 참고할 구조와 바꿔야 할 요소를 분리해서 보세요.
• 제목 그대로 복제 금지: ${analysis.warningsC.titleWarning}
• 썸네일 분위기 단순 복제 금지: ${analysis.warningsC.thumbnailWarning}
• 채널 콘셉트 무단 차용 금지: ${analysis.warningsC.channelConceptWarning}
• 안전한 참고 가이드: ${analysis.warningsC.safeReferenceGuide}

D. 내 채널용 차별화 방향
• 원본에서 참고할 구조: ${analysis.differentiationD.structureToAdopt}
• 반드시 바꿔야 할 요소: ${analysis.differentiationD.elementsToChange}
• 내 채널에 맞는 새로운 콘셉트: ${analysis.differentiationD.newUniqueConcept}
• 차별화 키워드: ${analysis.differentiationD.differentiationKeywords.join(', ')}

--------------------------------------------------------------------------------
[ 3단계: 추천 콘셉트 3개 (핵심 기획안) ]
--------------------------------------------------------------------------------

${planning.concepts.map((c, i) => `[추천 콘셉트 0${i + 1}: ${c.name}]
- 핵심 훅: ${c.hook}
- 제목 후보 1개: ${c.featuredTitle}
- 음악 방향: ${c.musicDirection}
- 썸네일 방향: ${c.thumbnailDirection}
- Suno 프롬프트 핵심 문장: ${c.sunoKeyPrompt}
- 상세 설명: ${c.description}
- 차별화 포인트: ${c.differentiation}`).join('\n\n')}

--------------------------------------------------------------------------------
[ 추가 제작 자료: 제목 후보 / 프롬프트 / 텍스트 ]
--------------------------------------------------------------------------------

■ 유튜브 제목 후보 7개
${planning.titleCandidates.map((t, i) => `${i + 1}. [${t.tag}] ${t.title}`).join('\n')}

■ 썸네일 이미지 프롬프트 3개
${planning.thumbnailPrompts.map((p, i) => `[옵션 ${i + 1}: ${p.label}]
- 한글: ${p.promptKo}
- 영문: ${p.promptEn}`).join('\n\n')}

■ Suno AI 음악 프롬프트 3개
${planning.sunoPrompts.map((s, i) => `[트랙 ${i + 1}: ${s.conceptName}]
- 스타일 프롬프트: ${s.promptText}
- 태그: ${s.styleTags} | 템포: ${s.bpmAndMood}`).join('\n\n')}

■ 유튜브 설명란 초안
${planning.youtubeDescription}

■ 고정 댓글 문구
${planning.pinnedComment}

■ 추천 해시태그 10개
${planning.hashtags.join(' ')}

================================================================================
“이 결과는 정답이 아니라, 내 채널 방향에 맞게 다시 다듬기 위한 기획 초안입니다.”

“이 도구는 플레이리스트를 복제하기 위한 도구가 아니라,
잘 되는 구조를 분석하고 나만의 콘셉트로 바꾸기 위한 기획 도구입니다.”
================================================================================`;
}
