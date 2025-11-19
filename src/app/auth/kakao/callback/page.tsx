// src/app/auth/kakao/callback/page.tsx
import { Suspense } from 'react'; // React에서 Suspense를 임포트
import KakaoCallbackClientPage from './KakaoCallbackClientPage'; // 새로 만든 클라이언트 컴포넌트 임포트

// 이 컴포넌트는 서버 컴포넌트이며, KakaoCallbackClientPage를 Suspense로 감싸서 렌더링
export default function KakaoCallbackPageWrapper() {
  return (
    <Suspense fallback={<div>카카오 로그인 처리 중...</div>}> {/* 로딩 중에 보여줄 UI */}
      <KakaoCallbackClientPage />
    </Suspense>
  );
}