// ./src/app/(routes)/career/interests/page.tsx
'use client'; // 클라이언트 훅(useState, useEffect, useRouter, useSearchParams)을 사용하므로 필수입니다.

import React, { Suspense, useEffect, useState } from 'react'; // Suspense를 추가로 import 합니다.
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter와 useSearchParams를 import 합니다.
import { FIELDS, type ThemeDef } from '@/lib/themes'; // 기존 import 유지: FIELDS 데이터와 ThemeDef 타입


// --- ⭐ InterestsContent 컴포넌트: useSearchParams 로직을 담을 내부 컴포넌트 ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하고, 그 결과에 따라 UI를 렌더링합니다.
// 메인 InterestsPage 컴포넌트 내부에 정의하여 코드를 분리하지 않습니다.
function InterestsContent() {
  const router = useRouter(); // useRouter는 이곳에서 사용 가능합니다.
  const sp = useSearchParams(); // ⚠️ useSearchParams()는 이제 여기서 호출됩니다!

  // 기존 로직 그대로 유지: suggested, candidates 상태 관리
  const suggested = sp.get('s')?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const [candidates, setCandidates] = useState<ThemeDef[]>([]);

  useEffect(() => {
    if (suggested && suggested.length > 0) {
      const valid = FIELDS.filter(f => suggested.includes(f.field));
      setCandidates(valid.slice(0, 3));
    } else {
      const shuffled = [...FIELDS].sort(() => Math.random() - 0.5);
      setCandidates(shuffled.slice(0, 3));
    }
  }, [sp]); // sp가 변경될 때마다 useEffect 재실행 (의존성 배열에 sp 포함)

  const goBack = () => router.push('/career/session'); // 기존 goBack 함수 유지

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold">관심 분야 선택</h1>
        <button
          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
          onClick={() => router.push('/')}
        >
          홈으로
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        상담사가 분석한 후보 분야입니다. 하나를 골라 계속 진행해 주세요.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {candidates.map((themeDef) => (
          <button
            key={themeDef.field}
            className="rounded-2xl border border-gray-200 shadow bg-white p-6 text-center hover:shadow-xl hover:scale-105 transition"
            onClick={() => {
              const q = new URLSearchParams({ field: themeDef.field });
              router.push(`/career/experience?${q.toString()}`);
            }}
          >
            <div className="text-xl font-bold text-indigo-600 mb-1">
              {themeDef.title || themeDef.field}
            </div>
            <div className="text-xs text-gray-500">선택하면 체험을 바로 시작합니다</div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
          onClick={goBack}
        >
          ← 화상채팅으로 돌아가기
        </button>
      </div>
    </main>
  );
}
// --- ⭐ InterestsContent 컴포넌트 정의 끝 ⭐ ---


// --- ⭐ 메인 InterestsPage 컴포넌트 ⭐ ---
// 이 컴포넌트는 'useSearchParams'를 직접 호출하지 않고, InterestsContent를 <Suspense>로 감싸서 렌더링합니다.
// 메인 페이지 컴포넌트는 최소한의 역할만 합니다.
export default function InterestsPage() {
  return (
    // ⚠️ 중요: InterestsContent 컴포넌트를 <Suspense>로 감싸줍니다! ⚠️
    // fallback에는 useSearchParams 데이터 로딩 중에 보여줄 간단한 UI를 넣어줍니다.
    // 이 부분은 프리렌더링 시 Contents가 준비될 때까지 사용자에게 보여줄 내용입니다.
    <Suspense fallback={<div>관심 분야 데이터를 불러오는 중...</div>}>
      <InterestsContent />
    </Suspense>
  );
}