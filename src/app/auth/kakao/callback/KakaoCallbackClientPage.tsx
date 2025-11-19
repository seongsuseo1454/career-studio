// src/app/auth/kakao/callback/KakaoCallbackClientPage.tsx
'use client'; // <-- 이 지시자는 그대로 유지

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ensureKakaoReady } from '@/lib/kakao';

type KakaoProfile = {
  kakao_account?: {
    email?: string;
    profile?: { nickname?: string; profile_image_url?: string };
  };
  id?: string | number;
};

// ✅ 컴포넌트 이름을 KakaoCallbackPage에서 KakaoCallbackClientPage로 변경
export default function KakaoCallbackClientPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [status, setStatus] = useState('카카오 인증 중...');
  const [profile, setProfile] = useState<KakaoProfile | null>(null);
  const [greeting, setGreeting] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const code = sp.get('code') || '';
    (async () => {
      try {
        // 1) Kakao 준비
        await ensureKakaoReady();

        // 2) code 확인
        if (!code) {
          setStatus('❌ 인증 코드가 없습니다.');
          return;
        }

        // 3) 로그인 상태면 바로 프로필 호출 가능
        setStatus('프로필 불러오는 중...');
        // window.Kakao!.API가 제대로 타입 추론이 안 될 수 있으므로,
        // 필요에 따라 'window.Kakao as any'로 타입 단언을 해줄 수 있습니다.
        const res = await (window.Kakao as any).API.request({ url: '/v2/user/me' });
        setProfile(res);

        const nickname = res?.kakao_account?.profile?.nickname || '학생';

        // 4) Gemini로 맞춤 인사(내부 프록시 가정: /api/gemini)
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
  }, [sp]); // sp (useSearchParams)가 의존성 배열에 있어야 올바르게 동작합니다.

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
          {/* ✅ 임시로 라우터 푸시 경로 변경 (현재 비디오/휠 페이지도 Suspense 적용해야 하므로) */}
          <button
            onClick={() => router.push('/career')} // /video 대신 Suspense 적용된 /career 페이지로 이동
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl px-5 py-2"
          >
            카카오 로그인 완료 → (임시)
          </button>
          {/* 이 버튼들은 /video, /wheel 페이지에 Suspense가 적용된 후에 활성화하는 것이 좋습니다. */}
          {/* <button
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
          </button> */}
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