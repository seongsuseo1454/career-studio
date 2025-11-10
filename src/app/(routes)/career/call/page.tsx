// ./src/app/(routes)/career/call/page.tsx
'use client'; // 클라이언트 훅을 사용하므로 필수입니다.

import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react'; // React에서 Suspense 추가
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter와 useSearchParams를 import 합니다.

// ✨ 타입 정의: Next.js App Router page 컴포넌트가 받는 기본 prop들 (이것 외에는 허용되지 않습니다!)
//    반드시 params와 searchParams만 정의해야 하며, 이들도 엄격하게 정의되어야 합니다.
interface NextStepPageProps {
  // `[slug]`와 같은 다이나믹 라우트가 있다면 'params'도 받을 수 있습니다.
  // params: { [key: string]: string | string[] }; // 예시: /career/call/[slug]
  // `useSearchParams`를 사용할 경우, 이 searchParams prop을 받을 수 있습니다.
  searchParams: { [key: string]: string | string[] }; // ⚠️ 필수적(non-optional)으로 변경! Next.js가 예상하는 형태입니다!
}


// TODO: 아래 import들은 산똘님의 원래 코드에서 사용하던 대로 유지해 주세요.
// 예시: import NextStepClient from '@/components/NextStepClient';
// 예시: import GlobalStyle from '@/components/GlobalStyle';
// 실제 파일이 없다면 주석 처리해주세요.

// ✨ 임시 NextStepClient 컴포넌트 (산똘님의 실제 NextStepClient로 대체해주세요!)
const NextStepClient = ({ paramFromUrl }: { paramFromUrl?: string }) => {
  return (
    <div>
      <p>NextStepClient (예시): URL 파라미터 = {paramFromUrl || '없음'}</p>
      {/* TODO: 여기에 NextStepClient의 실제 UI를 넣어주세요. */}
    </div>
  );
};

// ✨ 임시 GlobalStyle 컴포넌트 (산똘님의 실제 GlobalStyle로 대체해주세요!)
const GlobalStyle = () => {
  return (
    <style jsx global>{`
      /* TODO: 여기에 실제 GlobalStyle의 CSS 내용을 넣어주세요 */
      body { margin: 0; padding: 0; font-family: sans-serif; }
    `}</style>
  );
};


// --- ⭐ CallContent 컴포넌트: useSearchParams 로직을 담을 내부 컴포넌트 ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하고, 그 결과에 따라 UI를 렌더링합니다.
// 이 컴포넌트도 **prop을 직접 받지 않습니다.** 필요한 값은 searchParams에서 가져옵니다.
function CallContent() { // CallContent 컴포넌트도 어떤 prop도 받지 않습니다.
  const router = useRouter(); // CallContent 내부에서 router 사용 가능
  const searchParams = useSearchParams(); // ⚠️ useSearchParams()는 여기서 호출됩니다!

  // 💡 TODO: 원래 NextStep 컴포넌트에서 'counselor' prop으로 받던 값이
  //          URL의 searchParams에 있었다면 여기서 가져옵니다.
  //          예: ?counselor=머큐어리
  const counselor = searchParams.get('counselor') || '익명 상담사'; // URL에서 counselor 파라미터를 가져옵니다.

  // 💡 TODO: 그 외에 원래 NextStep 컴포넌트가 가졌던 모든 React 훅 (useState, useEffect, useMemo, useCallback 등) 사용과
  //          관련된 모든 로직과 UI를 모두 이 'CallContent' 함수 안으로 그대로 옮겨 주세요.
  const videoParam = searchParams.get('video_param'); // 예시: 'video_param' 쿼리 파라미터를 가져옴

  const handleSomeAction = () => {
    // router.push('/next-page'); // 예시: 라우팅 액션
    alert('다음 동작 실행');
  };

  return (
    <>
      <p>상담사: {counselor}</p>
      <p>URL에서 가져온 'video_param' 값: {videoParam || '없음'}</p>
      {/* 💡 TODO: useSearchParams 결과에 따라 렌더링되던 원래 NextStep의 UI 요소들을 여기에 넣어주세요. */}

      {/* NextStepClient가 useSearchParams의 결과(videoParam)를 필요로 한다면 여기에 prop으로 전달합니다. */}
      <NextStepClient paramFromUrl={videoParam} />

      {/* 💡 TODO: CallContent와 직접적인 관련이 없는 나머지 UI 요소들을 여기에 넣어주세요. */}
      <div>
        <h1>환영합니다! (Call Page)</h1>
        <button onClick={handleSomeAction} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          다음 동작 실행
        </button>
      </div>
    </>
  );
}
// --- ⭐ CallContent 컴포넌트 정의 끝 ⭐ ---


// --- ⭐ 메인 NextStep 페이지 컴포넌트 ⭐ ---
// ⚠️ 이 컴포넌트의 props는 Next.js App Router의 엄격한 규칙을 따릅니다.
//    { params, searchParams }만 허용됩니다. 그 외의 어떤 prop도 정의할 수 없습니다.
export default function NextStep(_props: NextStepPageProps) { // ⚠️ _props: NextStepPageProps 형태로 Next.js 규칙을 완벽히 따릅니다!
  return (
    <>
      <GlobalStyle /> {/* GlobalStyle 렌더링은 메인 페이지 컴포넌트에서 한 번만 합니다. */}
      {/* ⚠️ 중요: CallContent 컴포넌트를 <Suspense>로 감싸줍니다! ⚠️ */}
      <Suspense fallback={<div>영상 로딩 중입니다...</div>}>
        <CallContent /> {/* CallContent에는 이제 어떤 prop도 전달하지 않습니다. */}
      </Suspense>
    </>
  );
}