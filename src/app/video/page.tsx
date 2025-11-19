// src/app/video/page.tsx
import { Suspense } from 'react'; // React에서 Suspense를 임포트
import VideoIntroCall from '@/components/VideoIntroCall'; // ✅ 네 VideoIntroCall 클라이언트 컴포넌트 임포트 경로 확인

// 이 컴포넌트는 서버 컴포넌트이며, VideoIntroCall을 Suspense로 감싸서 렌더링
export default function VideoPageWrapper() {
  return (
    <Suspense fallback={<div>비디오 준비 중...</div>}> {/* 로딩 중에 보여줄 UI */}
      <VideoIntroCall />
    </Suspense>
  );
}