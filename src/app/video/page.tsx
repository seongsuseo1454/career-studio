// ./src/app/video/page.tsx
// [제목] 상담(화상+자기소개) 페이지 래퍼 (동적 로딩)
'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react'; // Suspense를 추가로 import 합니다.
import { useSearchParams } from 'next/navigation'; // useSearchParams를 import 합니다.

// ✨ 타입 정의: Next.js App Router page 컴포넌트가 받는 기본 prop들 (매개변수 에러 방지)
interface VideoPageProps {
  searchParams: { [key: string]: string | string[] }; // ⚠️ 필수적(non-optional)으로 변경!
}

// FIX: 동적으로 불러올 컴포넌트의 Prop 타입을 정의합니다.
// ⚠️ VideoIntroCall 컴포넌트는 counselorName prop을 받습니다. (네 원래 코드를 따름)
interface VideoIntroCallProps {
  counselorName: string;
}

// FIX: dynamic 함수에 정의한 Prop 타입을 제네릭으로 전달합니다.
const VideoIntroCall = dynamic<VideoIntroCallProps>(
  () => import('@/components/VideoIntroCall'),
  { ssr: false }
);


// ✨ 임시 GlobalStyle 컴포넌트 (산똘님의 실제 GlobalStyle로 대체해주세요!)
// ⚠️ 주의: <style jsx global> 사용 시 'Unexpected token style' 에러가 나면
//         'jsx global'을 제거하고 <style> 태그만 사용해야 합니다.
const GlobalStyle = () => {
  return (
    <style>{`
      /* TODO: 여기에 실제 GlobalStyle의 CSS 내용을 넣어주세요 */
      body { margin: 0; padding: 0; font-family: sans-serif; }
    `}</style>
  );
};


// --- ⭐ VideoContent 컴포넌트: useSearchParams 로직을 담을 내부 컴포넌트 ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하고, 그 결과에 따라 UI를 렌더링합니다.
// 이 컴포넌트도 prop을 받지 않습니다.
function VideoContent() {
  const sp = useSearchParams(); // ⚠️ useSearchParams()는 이제 여기서 호출됩니다!

  // ⚠️ 네 원래 로직대로 name을 여기서 가져와서 VideoIntroCall에 prop으로 전달합니다.
  const name = sp.get('counselor') || '세종대왕'; 
  
  // VideoIntroCall 컴포넌트에 Prop을 전달합니다.
  return <VideoIntroCall counselorName={name} />; // ⚠️ VideoIntroCall에 counselorName prop을 전달합니다!
}
// --- ⭐ VideoContent 컴포넌트 정의 끝 ⭐ ---


// --- ⭐ 메인 Page 컴포넌트 ⭐ ---
// ⚠️ 이 컴포넌트는 Next.js App Router의 규칙에 맞게 searchParams를 받도록 정의합니다.
export default function Page(_props: VideoPageProps) { // ⚠️ _props: VideoPageProps 추가!
  return (
    <>
      <GlobalStyle /> {/* GlobalStyle 렌더링은 메인 페이지 컴포넌트에서 한 번만 합니다. */}
      {/* ⚠️ 중요: VideoContent 컴포넌트를 <Suspense>로 감싸줍니다! ⚠️ */}
      <Suspense fallback={<div>화상 상담 정보 불러오는 중...</div>}>
        <VideoContent />
      </Suspense>
    </>
  );
}