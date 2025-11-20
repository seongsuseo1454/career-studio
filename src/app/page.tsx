// src/app/page.tsx   ← 이 파일만 교체하면 끝!
import { redirect } from 'next/navigation';

export default function Home() {
  // 무조건 코드 입력 화면으로 강제 이동
  redirect('/enter-code');
}