// src/app/wheel/layout.tsx
import { Suspense } from 'react';

export default function WheelLayout({ children }: { children: React.ReactNode }) {
  return (
    // ✨ 이 Suspense가 WheelPage 내부의 useSearchParams 오류를 해결해 줄 거야.
    <Suspense fallback={<div>룰렛 페이지를 불러오는 중...</div>}>
      {children}
    </Suspense>
  );
}