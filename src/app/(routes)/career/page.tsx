'use client';

// ⭐ 여기! Suspense를 import 해야 해! ⭐
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 필요 시 여러분 컴포넌트로 교체
const CareerSelector = () => (
  <div className="p-4 rounded-xl bg-white border">관심분야를 선택하고 아래 버튼을 누르세요.</div>
);

// ⭐ useSearchParams를 사용하는 부분을 새 컴포넌트로 분리했어! ⭐
// 이렇게 분리한 후, 부모 컴포넌트에서 이 CareerContentWrapper를 Suspense로 감싸줄 거야.
const CareerContentWrapper = () => {
  const router = useRouter();
  const sp = useSearchParams(); // 이제 useSearchParams는 이 컴포넌트 안에 있어!

  const keepQS = (() => {
    const q = new URLSearchParams(sp.toString());
    if (!q.get('level')) q.set('level', '고등학생');
    if (!q.get('field')) q.set('field', 'medical-bio'); // 관련분야 기본값
    return `?${q.toString()}`;
  })();

  return (
    <>
      <CareerSelector />
      <div className="mt-6">
        <button
          onClick={() => router.push(`/career/themes${keepQS}`)}
          className="rounded-xl bg-blue-600 text-white px-6 py-3 font-bold hover:bg-blue-700"
        >
          직업 테마 선택으로 →
        </button>
      </div>
    </>
  );
};

export default function CareerPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-extrabold mb-4">관심분야 선택</h1>
      {/* ⭐ 여기! CareerContentWrapper를 Suspense로 감싸줘! ⭐ */}
      <Suspense fallback={<div>관심분야 로딩 중...</div>}>
        <CareerContentWrapper />
      </Suspense>
    </main>
  );
}