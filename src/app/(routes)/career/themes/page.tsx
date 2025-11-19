// src/app/(routes)/career/themes/page.tsx
import { Suspense } from 'react';
import CareerThemesClientPage from './CareerThemesClientPage'; // ✅ Client Component 임포트

export default function ThemesPageWrapper() {
  return (
    // ✨ CareerThemesClientPage 컴포넌트를 Suspense로 감싸줍니다.
    <Suspense fallback={<div>테마 정보를 불러오는 중...</div>}>
      <CareerThemesClientPage />
    </Suspense>
  );
}