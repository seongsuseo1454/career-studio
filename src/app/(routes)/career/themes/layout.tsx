// src/app/(routes)/career/themes/layout.tsx
import { Suspense } from 'react';

export default function CareerThemesLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✨ 이 Suspense가 CareerThemesClientPage 내부의 useSearchParams 오류를 해결해 줄 거야.
    <Suspense fallback={<div>직업 테마 페이지를 불러오는 중...</div>}>
      {children}
    </Suspense>
  );
}