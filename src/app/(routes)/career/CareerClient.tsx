// D:\youth-career-studio\src\app\(routes)\career\themes\CareerThemesContent.tsx
'use client'; // ⚠️ 반드시 클라이언트 컴포넌트임을 명시해야 합니다.


import React, { useMemo, useCallback } from 'react'; // React를 import 합니다.
import { useRouter, useSearchParams } from 'next/navigation';
import { getField, getFieldLabel, getJobIndex } from '@/lib/careers/registry';


// ──────────────────────────────────────────────────────────
// 쿼리 도우미 (네가 준 기존 코드 그대로 유지)
const pick = (sp: ReturnType<typeof useSearchParams>, k: string, d = '') =>
  (sp.get(k) ?? d).toString();


// 관심분야 정규화 (10개) (네가 준 기존 코드 그대로 유지)
const normalizeField = (v: string) => {
  const s = (v || '').toLowerCase();
  if (/(robot|mecha|메카|로봇)/.test(s)) return 'robot-mechatronics';
  if (/(space|aero|항공|우주)/.test(s)) return 'space-aero';
  if (/(auto|mobility|모빌|자율주행)/.test(s)) return 'mobility';
  if (/(ai|data|데이터|인공지능)/.test(s)) return 'ai-data';
  if (/(cyber|security|보안)/.test(s)) return 'cyber-security';
  if (/(medical|bio|의료|바이오)/.test(s)) return 'medical-bio';
  if (/(nursing|rehab|간호|재활)/.test(s)) return 'nursing-rehab';
  if (/(env|energy|환경|에너지)/.test(s)) return 'env-energy';
  if (/(software|app|소프트|앱)/.test(s)) return 'software-app';
  if (/(game|meta|게임|메타|메타버스)/.test(s)) return 'game-metaverse';
  return 'ai-data';
};


// 버튼 팔레트 (네가 준 기존 코드 그대로 유지)
const PALETTE = [
  { color: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  { color: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  { color: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
];


// 분야별 기본 3카드(문제은행 인덱스 없거나, 3개 미만일 때 보강용)
const DEFAULT_THEMES: Record<
  string,
  Array<{ key: string; title: string; desc: string }>
> = {
  'ai-data': [
    { key: 'data-scientist', title: '데이터 사이언티스트', desc: '데이터로 비즈니스 인사이트 도출' },
    { key: 'ai-researcher', title: '인공지능 연구원', desc: '모델/알고리즘 연구·개발' },
    { key: 'bigdata-analyst', title: '빅데이터 분석가', desc: '대규모 데이터 처리·시각화' },
  ],
  'software-app': [
    { key: 'frontend-dev', title: '프론트엔드 개발자', desc: '웹 UI/UX 구현' },
    { key: 'backend-dev', title: '백엔드 개발자', desc: 'API·DB·서버 설계' },
    { key: 'mobile-dev', title: '모바일 앱 개발자', desc: 'iOS/Android 앱' },
  ],
  'robot-mechatronics': [
    { key: 'robot-engineer', title: '로봇 엔지니어', desc: '센서·액추에이터 통합 제어' },
    { key: 'mechatronics-dev', title: '메카트로닉스 개발자', desc: 'HW/SW 융합 시스템' },
    { key: 'automation-tech', title: '자동화 기술자', desc: '생산라인 자동화' },
  ],
  'space-aero': [
    { key: 'aerospace-engineer', title: '항공우주 엔지니어', desc: '비행체 구조/추력 설계' },
    { key: 'satellite-operator', title: '위성 운용 전문가', desc: '위성 데이터·지상국 운용' },
    { key: 'avionics-engineer', title: '항공전자 엔지니어', desc: '항공기 전자/항법 시스템' },
  ],
  mobility: [
    { key: 'ev-powertrain', title: '전기차 파워트레인', desc: '배터리·모터·인버터' },
    { key: 'adas-autonomy', title: '자율주행/ADAS', desc: '센싱·제어·맵핑' },
    { key: 'vehicle-design', title: '차량 설계', desc: '차체/내장/인체공학' },
  ],
  'cyber-security': [
    { key: 'security-analyst', title: '보안 분석가', desc: '침해사고 탐지/대응' },
    { key: 'penetration-tester', title: '모의해킹 전문가', desc: '취약점 진단·가이드' },
    { key: 'soc-engineer', title: 'SOC 엔지니어', desc: '보안 자동화/탐지 룰' },
  ],
  'medical-bio': [
    { key: 'clinician', title: '임상의사', desc: '진료/진단/치료 계획' },
    { key: 'bio-researcher', title: '바이오 연구원', desc: '질병 메커니즘·신약' },
    { key: 'med-ai', title: '의료 AI 엔지니어', desc: '의료영상/EMR 모델링' },
  ],
  // ✅ 5) 간호·재활
  'nursing-rehab': [
    { key: 'rn', title: '간호사', desc: '환자 돌봄·의료 협업·기본 간호' },
    { key: 'ot', title: '작업치료사', desc: 'ADL 향상·감각/운동 재활' },
    { key: 'pt', title: '물리치료사', desc: '근골격/신경계 물리치료' },
  ],
  // ✅ 6) 환경·에너지
  'env-energy': [
    { key: 'env-engineer', title: '환경공학기술자', desc: '대기/수질/폐기물 공정 설계' },
    { key: 'renewable-eng', title: '신재생에너지 전문가', desc: '태양광/풍력/ESS/수소' },
    { key: 'water-quality-analyst', title: '수질분석 기사', desc: '시료 채취·분석·QA/QC' },
  ],
  // ✅ 7) 우주·항공
  'space-aero-alt': [
    { key: 'aerospace-engineer', title: '항공우주 엔지니어', desc: '비행성능/구조/추력' },
    { key: 'satellite-operator', title: '위성 운용 전문가', desc: '임무계획·지상국 운영' },
    { key: 'avionics-engineer', title: '항공전자 엔지니어', desc: '항법/통신/비행제어' },
  ],
  // ✅ 8) 자동차·모빌리티
  'mobility-alt': [
    { key: 'ev-powertrain', title: '전기차 파워트레인', desc: '배터리·구동·인버터' },
    { key: 'adas-autonomy', title: '자율주행/ADAS', desc: '인지·판단·제어' },
    { key: 'vehicle-design', title: '차량 설계', desc: '차체/내장/안전/NVH' },
  ],
};


// 분야 가이드 (네가 준 기존 코드 그대로 유지)
const FIELD_GUIDE: Record<string, string> = {
  'ai-data': '선택한 관심분야의 대표 직무를 체험합니다. 데이터 수집/분석/모델링을 다룹니다.',
  'software-app': '웹/앱 개발 전반—UI, API, 배포까지 실무 흐름을 익힙니다.',
  'robot-mechatronics': '센서·제어·기구가 결합된 메카트로닉스 기반 로봇을 이해합니다.',
  'space-aero': '항공우주 시스템, 위성/비행체 설계와 운용을 살펴봅니다.',
  mobility: '전동화/자율주행/커넥티드카 등 미래 모빌리티를 체험합니다.',
  'cyber-security': '침해사고 대응, 모의해킹, 보안 자동화를 경험합니다.',
  'medical-bio': '의료/바이오 R&D 및 임상 데이터 활용 기초를 익힙니다.',
  'nursing-rehab': '간호/재활의 실제 케어 과정과 팀 협업을 이해합니다.',
  'env-energy': '에너지 전환/환경 규제 대응과 분석을 체험합니다.',
  'game-metaverse': '게임/메타버스 제작 파이프라인을 경험합니다.',
};


// ──────────────────────────────────────────────────────────
// ⚠️ default export 이름이 CareerThemesPage에서 CareerThemesContent로 변경됩니다.
export default function CareerThemesContent() {
  const router = useRouter();
  const sp = useSearchParams();


  // 쿼리 유지 (네가 준 기존 코드 그대로 유지)
  const keepQS = useMemo(() => { // ✅ useMemo 괄호 마무리 및 의존성 추가
    const keep = new URLSearchParams();
    [
      "level", "field",
      // 여기에 원래 keepQS에 포함시켰던 다른 쿼리 파라미터 키들을 추가해주세요.
      // 예시: "someOtherParam", "anotherOne"
    ].forEach((k) => {
      const v = sp.get(k);
      if (v) keep.set(k, v);
    });

    if (!keep.get("level")) keep.set("level", "고등학생");
    if (!keep.get("field")) keep.set("field", "medical-bio"); // 관련분야 기본값
    return `?${keep.toString()}`;
  }, [sp]); // ✅ useMemo 의존성 배열 추가


  // 네가 준 나머지 로직과 UI를 그대로 복원했습니다.
  const currentField = normalizeField(sp.get('field'));
  const currentFieldLabel = getFieldLabel(currentField) || '미정';
  const themesInField = DEFAULT_THEMES[currentField] || DEFAULT_THEMES['ai-data'];

  // 선택 로직 (클릭 시 쿼리 반영하여 경험 페이지로 이동)
  const handleThemeClick = useCallback((themeKey: string) => {
    const q = new URLSearchParams(keepQS); // 현재 쿼리 유지
    q.set('job', themeKey); // 선택한 직업 반영
    router.push(`/career/experience?${q.toString()}`);
  }, [router, keepQS]); // ✅ useCallback 의존성 배열 추가

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-extrabold mb-4">직업 테마 선택</h1>
      <p className="mt-2 text-lg text-gray-700">
        선택한 분야: <span className="font-semibold text-indigo-600">{currentFieldLabel}</span>
      </p>
      <p className="text-gray-600 mb-6">{FIELD_GUIDE[currentField]}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themesInField.map((theme, idx) => (
          <button
            key={theme.key}
            onClick={() => handleThemeClick(theme.key)}
            className={`rounded-2xl border border-gray-200 shadow bg-white p-6 text-left transform transition hover:scale-105 ${PALETTE[idx % PALETTE.length].color} ${PALETTE[idx % PALETTE.length].hover}`}
          >
            <div className={`text-xl font-bold mb-1 ${PALETTE[idx % PALETTE.length].color}`}>{theme.title}</div>
            <div className="text-sm text-gray-500">{theme.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push(`/career?${keepQS.split('?')[1]}`)}
          className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
        >
          ← 다른 분야 선택
        </button>
      </div>
    </main>
  );
}
