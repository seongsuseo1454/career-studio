// D:\youth-career-studio\src\app\(routes)\career\themes\page.tsx
'use client'; // ⚠️ 이 래퍼 페이지는 클라이언트 컴포넌트임을 명시합니다.

import React, { Suspense } from 'react'; // React에서 Suspense를 import 합니다.
import dynamic from 'next/dynamic';     // dynamic import를 위해 필요합니다.

// ✨ 타입 정의: Next.js App Router page 컴포넌트가 받는 prop들 (이제 사용하지 않으므로 제거)
// interface CareerThemesPageProps {
//   searchParams: { [key: string]: string | string[] | undefined }; // searchParams 타입을 명확히 정의
// }

// ✨ GlobalStyle 컴포넌트 (산똘님의 실제 GlobalStyle로 대체해주세요!)
const GlobalStyle = () => {
  return (
    <style>{`
      body { margin: 0; padding: 0; font-family: sans-serif; }
    `}</style>
  );
};


// --- ⭐ CareerThemesContent 컴포넌트를 동적으로 불러오기 ⭐ ---
// 이 컴포넌트가 useSearchParams를 직접 사용하므로, ssr: false로 클라이언트에서만 렌더링되도록 합니다.
const CareerThemesContent = dynamic(
  () => import('./CareerThemesContent'), // ⚠️ './CareerThemesContent.tsx'가 아닌 './CareerThemesContent' 입니다.
  {
    ssr: false, // ⚠️ 매우 중요: 이 컴포넌트는 서버 사이드 렌더링되지 않도록 합니다.
    loading: () => <div>직업 테마 메뉴 로딩 중입니다...</div>, // 로딩 중 보여줄 fallback UI
  }
);


// --- ⭐ 메인 CareerThemesPage 컴포넌트 ⭐ ---
// searchParams prop을 받지 않으므로, CareerThemesPageProps도 더 이상 필요 없습니다.
export default function CareerThemesPage() {
  return (
    <>
      <GlobalStyle />
      <Suspense fallback={<div>직업 테마 정보 로딩 중입니다...</div>}>
        <CareerThemesContent />
      </Suspense>
    </>
  );
}