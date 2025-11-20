// app/enter-code/page.tsx   ← 이 경로에 새 파일 만들어 주세요
import { redirect } from 'next/navigation';

export default function EnterCodePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="text-center">
        <h1 className="mb-10 text-6xl font-bold tracking-wider md:text-8xl">
          진로야 체험관
        </h1>
        <p className="mb-12 text-2xl md:text-4xl">
          기관 전용 코드 입력
        </p>

        <input
          type="text"
          placeholder="예: GANGNAM-HS"
          autoFocus
          className="w-80 rounded-3xl border-4 border-white/30 bg-white/10 px-8 py-6 text-center text-3xl font-bold uppercase text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:border-white md:w-96 md:text-4xl"
          onKeyUp={(e) => {
            const input = (e.target as HTMLInputElement).value.trim().toUpperCase();
            if (e.key === 'Enter' && input) {
              redirect(`/?code=${input}`);
            }
          }}
        />

        <p className="mt-10 text-lg opacity-90 md:text-xl">
          납품받은 기관 코드를 입력해 주세요
        </p>
      </div>
    </div>
  );
}