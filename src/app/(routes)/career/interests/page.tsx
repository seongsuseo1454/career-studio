// src/app/(routes)/career/interests/page.tsx
import { Suspense } from 'react'; // React에서 Suspense를 임포트
import CareerInterestsClient from './CareerInterestsClient'; // 새로 만든 클라이언트 컴포넌트 임포트

// 이 컴포넌트는 서버 컴포넌트이며, CareerInterestsClient를 Suspense로 감싸서 렌더링
export default function InterestsPageWrapper() {
  return (
    <Suspense fallback={<div>흥미 결과를 불러오는 중...</div>}> {/* 로딩 중에 보여줄 UI */}
      <CareerInterestsClient />
    </Suspense>
  );
}