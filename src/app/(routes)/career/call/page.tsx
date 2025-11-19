// src/app/(routes)/career/call/page.tsx
import { Suspense } from 'react'; // React에서 Suspense를 임포트
import CareerCallClient from './CareerCallClient'; // 새로 만든 클라이언트 컴포넌트 임포트

// 이 컴포넌트는 서버 컴포넌트이며, CareerCallClient를 Suspense로 감싸서 렌더링
export default function CareerCallPageWrapper() {
  return (
    <Suspense fallback={<div>상담 연결 화면을 불러오는 중...</div>}> {/* 로딩 중에 보여줄 UI */}
      <CareerCallClient />
    </Suspense>
  );
}