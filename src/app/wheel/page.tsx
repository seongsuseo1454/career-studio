// ./src/app/wheel/page.tsx
'use client'; // 클라이언트 훅을 사용하므로 필수입니다.

import React, { Suspense, useCallback } from 'react'; // Suspense를 추가로 import 합니다.
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter와 useSearchParams를 import 합니다.

// TODO: 아래 import들은 산똘님의 원래 코드에서 사용하던 대로 유지해 주세요.
//       AvatarPieWheel, Avatar가 '../../components/AvatarPieWheel'에서 온다면 import 합니다.
//       실제 파일이 없다면 주석 처리하거나 해당 컴포넌트들을 정의해야 합니다.
import AvatarPieWheel, { Avatar } from '../../components/AvatarPieWheel'; // 기존 import 유지

// ✨ 타입 정의: Next.js App Router page 컴포넌트가 받는 기본 prop들 (매개변수 에러 방지)
interface WheelPageProps {
  searchParams: { [key: string]: string | string[] }; // ⚠️ 필수적(non-optional)으로 변경!
}

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


// --- ⭐ WheelContent 컴포넌트: useSearchParams 로직을 담을 내부 컴포넌트 ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하고, 그 결과에 따라 UI를 렌더링합니다.
function WheelContent() { // WheelContent 컴포넌트도 어떤 prop도 받지 않습니다.
  const router = useRouter();
  const sp = useSearchParams(); // ⚠️ useSearchParams()는 이제 여기서 호출됩니다!

  // 다음 단계 이동 (안전가드 포함)
  const goVideo = useCallback((picked: Avatar) => {
    const name = picked?.name?.trim();
    if (!name) {
      alert('상담사를 먼저 선택해주세요.');
      return;
    }
    const params = new URLSearchParams(sp.toString());
    params.set('counselor', name); // 선택한 상담사 반영
    router.push(`/video?${params.toString()}`); // 다음 단계로 이동
  }, [router, sp]); // sp와 router를 의존성 배열에 추가합니다.


  return (
    <main className="relative mx-auto max-w-5xl px-5 py-10">
      {/* ✅ 홈으로: 상단 왼쪽 고정 */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-20 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow"
      >
        홈으로
      </button>


      <h1 className="text-3xl font-extrabold text-gray-900">아바타 관심분야 휠</h1>
      <p className="mt-2 text-gray-600">원하는 상담사를 선택하면 다음 단계로 이동합니다.</p>


      <div className="mt-8 flex items-center justify-center">
        <AvatarPieWheel onNext={goVideo} />
      </div>
    </main>
  );
}
// --- ⭐ WheelContent 컴포넌트 정의 끝 ⭐ ---


// --- ⭐ 메인 WheelPage 컴포넌트 ⭐ ---
// ⚠️ 이 컴포넌트의 props는 Next.js App Router의 엄격한 규칙을 따릅니다.
//    (searchParams만 허용됩니다. 필요한 경우 params도 추가)
export default function WheelPage(_props: WheelPageProps) { // ⚠️ _props: WheelPageProps 추가
  return (
    <>
      <GlobalStyle /> {/* GlobalStyle 렌더링은 메인 페이지 컴포넌트에서 한 번만 합니다. */}
      {/* ⚠️ 중요: WheelContent 컴포넌트를 <Suspense>로 감싸줍니다! ⚠️ */}
      <Suspense fallback={<div>휠 콘텐츠 로딩 중입니다...</div>}>
        <WheelContent />
      </Suspense>
    </>
  );
}