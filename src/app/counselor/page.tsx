// ./src/app/counselor/page.tsx
// [제목] 상담(화상+자기소개) 페이지 래퍼 (동적 로딩) - 원래는 /video 페이지 코드였지만, 이제 /counselor 페이지로 간주합니다.
'use client'; // 클라이언트 훅을 사용하므로 필수입니다.

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react'; // Suspense를 추가로 import 합니다.
import { useSearchParams } from 'next/navigation';

// FIX: 동적으로 불러올 컴포넌트의 Prop 타입을 정의합니다.
// 이는 TypeScript에게 VideoIntroCall 컴포넌트가 counselorName prop을 받음을 알려줍니다.
interface VideoIntroCallProps {
  counselorName: string;
}

// FIX: dynamic 함수에 정의한 Prop 타입을 제네릭으로 전달합니다.
const VideoIntroCall = dynamic<VideoIntroCallProps>(
  () => import('@/components/VideoIntroCall'),
  { ssr: false }
);


// ✨ 타입 정의: Next.js App Router page 컴포넌트가 받는 기본 prop들
//    이 페이지는 /counselor/page.tsx 이므로 CounselorPageProps라고 명명합니다.
interface CounselorPageProps {
  searchParams: { [key: string]: string | string[] }; // 필수적(non-optional)으로 변경
}


// --- ⭐ CounselorContent 컴포넌트: useSearchParams 로직을 담을 내부 컴포넌트 ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하고, 그 결과에 따라 UI를 렌더링합니다.
function CounselorContent() { // 이 내부 컴포넌트도 어떤 prop을 직접 받지 않습니다.
  const sp = useSearchParams(); // ⚠️ useSearchParams()는 이제 여기서 호출됩니다!

  const name = sp.get('counselor') || '세종대왕'; // 기존 로직 유지 (URL에서 counselor 파라미터를 가져옴)
  
  // VideoIntroCall 컴포넌트에 Prop이 올바르게 전달되어 빨간 줄이 사라집니다.
  return <VideoIntroCall counselorName={name} />;
}
// --- ⭐ CounselorContent 컴포넌트 정의 끝 ⭐ ---


// --- ⭐ 메인 Page 컴포넌트 (원래 이름이 Page인 듯) ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하지 않고, CounselorContent를 <Suspense>로 감싸서 렌더링합니다.
export default function Page(_props: CounselorPageProps) { // ⚠️ _props: CounselorPageProps 추가
  return (
    // ⚠️ 중요: CounselorContent 컴포넌트를 <Suspense>로 감싸줍니다! ⚠️
    // fallback에는 useSearchParams 데이터 로딩 중에 보여줄 간단한 UI를 넣어줍니다.
    <Suspense fallback={<div>상담사 정보 불러오는 중...</div>}>
      <CounselorContent />
    </Suspense>
  );
}