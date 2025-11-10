// ./src/app/auth/kakao/callback/page.tsx
'use client'; // 클라이언트 훅을 사용하므로 필수입니다.

import React, { Suspense, useState, useEffect, useMemo, useCallback } from 'react'; // Suspense 추가
import { useRouter, useSearchParams } from 'next/navigation'; // useRouter와 useSearchParams를 import 합니다.
import { ensureKakaoReady } from '@/lib/kakao'; // 기존 import 유지


// ✨ 타입 정의: Next.js App Router page 컴포넌트가 받는 기본 prop들
interface NextStepPageProps {
  searchParams: { [key: string]: string | string[] }; // ⚠️ 필수적(non-optional)으로 변경!
}

// ✨ KakaoProfile 타입 정의를 최상단으로 옮깁니다. (이전에 이미 옮겼을 것입니다)
type KakaoProfile = {
  kakao_account?: {
    email?: string;
    profile?: { nickname?: string; profile_image_url?: string };
  };
  id?: string | number;
};


// ⭐ GlobalStyle 컴포넌트를 파일의 최상단으로 옮깁니다! ⭐
// 이렇게 함으로써 KakaoCallbackPage 컴포넌트에서도 GlobalStyle을 인식하고 사용할 수 있습니다.
const GlobalStyle = () => {
  return (
    <style jsx global>{`
      /* TODO: 여기에 실제 GlobalStyle의 CSS 내용을 넣어주세요 */
      body { margin: 0; padding: 0; font-family: sans-serif; }
    `}</style>
  );
};


// ✨ 임시 NextStepClient 컴포넌트 (산똘님의 실제 NextStepClient로 대체해주세요!)
const NextStepClient = ({ paramFromUrl }: { paramFromUrl?: string }) => {
  return (
    <div>
      <p>NextStepClient (예시): URL 파라미터 = {paramFromUrl || '없음'}</p>
      {/* TODO: 여기에 NextStepClient의 실제 UI를 넣어주세요. */}
    </div>
  );
};


// --- ⭐ KakaoCallbackContent 컴포넌트: useSearchParams 로직을 담을 내부 컴포넌트 ⭐ ---
function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState('카카오 인증 중...');
  const [profile, setProfile] = useState<KakaoProfile | null>(null);
  const [greeting, setGreeting] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code') || '';
    (async () => {
      try {
        await ensureKakaoReady();

        if (!code) {
          setStatus('❌ 인증 코드가 없습니다.');
          return;
        }

        setStatus('프로필 불러오는 중...');
        const res = await window.Kakao!.API.request({ url: '/v2/user/me' });
        setProfile(res);

        const nickname = res?.kakao_account?.profile?.nickname || '학생';

        setStatus('AI 인사 생성 중...');
        const aiRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            prompt: `다음 사용자를 위한 1문장 인사말을 존댓말로 상냥하게.- 닉네임: ${nickname}문장 1개, 따옴표 없이.`,
          }),
        });

        if (!aiRes.ok) {
          const e = await aiRes.json().catch(() => ({}));
          throw new Error(e?.error || `Gemini API 오류(${aiRes.status})`);
        }
        const data = await aiRes.json();
        setGreeting((data?.text || '').trim());
        setStatus('✅ 로그인 성공!');
      } catch (e: any) {
        console.error(e);
        setErrMsg(e?.message || '알 수 없는 오류');
        setStatus('⚠️ 로그인/AI 처리 중 오류가 발생했습니다.');
      }
    })();
  }, [searchParams]);

  const nickname = profile?.kakao_account?.profile?.nickname || '학생';
  const email = profile?.kakao_account?.email;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-md w-full p-6 text-center rounded-2xl bg-white/10 ring-1 ring-white/10 shadow-xl">
        <h1 className="text-2xl font-bold mb-3">카카오 로그인 결과</h1>

        <p className="text-emerald-300 font-semibold mb-2">{status}</p>
        {errMsg && <p className="text-red-300 text-sm mb-3">에러: {errMsg}</p>}

        {profile && (
          <div className="bg-white/10 p-4 rounded-lg text-sm text-gray-100 text-left mb-4">
            <p><b>닉네임:</b> {nickname}</p>
            {email ? <p><b>이메일:</b> {email}</p> : null}
          </div>
        )}

        {greeting && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-400/40 p-4 text-emerald-200">
            <p className="font-semibold">{greeting}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push('/video')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl px-5 py-2"
          >
            화상상담으로 이동
          </button>
          <button
            onClick={() => router.push('/wheel')}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl px-5 py-2"
          >
            체험 시작(상담사 선택) →
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl px-5 py-2"
          >
            홈으로
          </button>
        </div>

        <p className="text-[11px] mt-3 text-gray-300/80">
          ※ Kakao 콘솔의 Redirect URI와 .env의 NEXT_PUBLIC_KAKAO_REDIRECT_URI가 정확히 일치해야 합니다.
        </p>
      </div>
    </main>
  );
}
// --- ⭐ KakaoCallbackContent 컴포넌트 정의 끝 ⭐ ---


// --- ⭐ 메인 KakaoCallbackPage 컴포넌트 ⭐ ---
export default function KakaoCallbackPage(_props: NextStepPageProps) {
  return (
    <>
      <GlobalStyle /> {/* GlobalStyle 렌더링은 메인 페이지 컴포넌트에서 한 번만 합니다. */}
      {/* ⚠️ 중요: KakaoCallbackContent 컴포넌트를 <Suspense>로 감싸줍니다! ⚠️ */}
      <Suspense fallback={<div>카카오 로그인 정보 처리 중...</div>}>
        <KakaoCallbackContent />
      </Suspense>
    </>
  );
}