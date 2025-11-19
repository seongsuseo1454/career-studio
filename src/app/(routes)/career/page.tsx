// src/app/(routes)/career/page.tsx

import { Suspense } from 'react';
import CareerClientPage from './CareerClientPage';

export default function CareerPageWrapper() {
  return (
    <Suspense fallback={<div>관심분야 정보를 불러오는 중...</div>}>
      <CareerClientPage />
    </Suspense>
  );
}