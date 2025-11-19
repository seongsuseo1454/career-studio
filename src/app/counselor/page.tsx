// src/app/counselor/page.tsx
import { Suspense } from 'react'; // React에서 Suspense를 임포트
import CounselorPageClient from './CounselorPageClient'; // 새로 만든 클라이언트 컴포넌트 임포트

// 이 컴포넌트는 서버 컴포넌트이며, CounselorPageClient를 Suspense로 감싸서 렌더링
export default function CounselorPageWrapper() {
  return (
    <Suspense fallback={<div>상담사 목록을 불러오는 중...</div>}> {/* 로딩 중에 보여줄 UI */}
      <CounselorPageClient />
    </Suspense>
  );
}