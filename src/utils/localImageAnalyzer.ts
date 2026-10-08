import { ThumbnailAnalysisInfo } from '../types/playlist';

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getApproximateColorName(r: number, g: number, b: number): string {
  // Simple intuitive palette categorization
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  if (diff < 20) {
    if (r < 70) return '딥 블랙 & 차콜';
    if (r > 190) return '클린 화이트 & 페일 그레이';
    return '차분한 뉴트럴 그레이';
  }

  if (r > g && r > b) {
    if (g > b && (r - g) < 50) {
      return r > 180 ? '따뜻한 웜 베이지 & 크림' : '따뜻한 어스 브라운 & 앰버';
    }
    return r > 160 ? '따뜻한 코랄 & 로즈' : '딥 와인 & 버건디';
  }

  if (b > r && b > g) {
    return b > 140 ? '청량한 스카이 & 파스텔 블루' : '깊은 야간 딥 네이비';
  }

  if (g > r && g > b) {
    return g > 130 ? '편안한 세이지 & 민트' : '차분한 포레스트 그린';
  }

  return '은은한 빈티지 톤';
}

export function analyzeThumbnailImage(file: File): Promise<ThumbnailAnalysisInfo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('이미지 파일을 읽을 수 없습니다.'));

    reader.onload = () => {
      const img = new Image();
      const previewUrl = reader.result as string;

      img.onerror = () => reject(new Error('이미지 객체 생성에 실패했습니다.'));

      img.onload = () => {
        // In-memory thumbnail canvas for speedy analysis (64x64)
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            fileName: file.name,
            previewUrl,
            dominantColorHex: '#888888',
            dominantColorName: '기본 톤',
            brightness: '중간',
            colorMood: '차분함',
            impressionMemo: '로컬 이미지 기본 로드 완료'
          });
          return;
        }

        ctx.drawImage(img, 0, 0, 64, 64);
        const imgData = ctx.getImageData(0, 0, 64, 64).data;

        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let totalLuminance = 0;
        let totalSaturation = 0;
        const count = imgData.length / 4;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          totalR += r;
          totalG += g;
          totalB += b;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          totalSaturation += (max - min);
        }

        const avgR = totalR / count;
        const avgG = totalG / count;
        const avgB = totalB / count;
        const avgLum = totalLuminance / count;
        const avgSat = totalSaturation / count;

        // Brightness evaluation
        let brightness: '밝음' | '중간' | '어두움' = '중간';
        if (avgLum > 160) {
          brightness = '밝음';
        } else if (avgLum < 90) {
          brightness = '어두움';
        }

        // Color Mood evaluation
        let colorMood: '따뜻함' | '차분함' | '선명함' | '부드러움' = '차분함';
        if (avgSat > 55) {
          colorMood = '선명함';
        } else if (avgSat < 25) {
          colorMood = '부드러움';
        } else if (avgR > avgB + 12) {
          colorMood = '따뜻함';
        } else {
          colorMood = '차분함';
        }

        const dominantColorHex = rgbToHex(avgR, avgG, avgB);
        const dominantColorName = getApproximateColorName(avgR, avgG, avgB);

        const impressionMemo = `전반적으로 [${brightness}] 밝기에 [${colorMood}] 무드의 ${dominantColorName}(${dominantColorHex}) 톤이 중심을 이룹니다.`;

        resolve({
          fileName: file.name,
          previewUrl,
          dominantColorHex,
          dominantColorName,
          brightness,
          colorMood,
          impressionMemo
        });
      };

      img.src = previewUrl;
    };

    reader.readAsDataURL(file);
  });
}
