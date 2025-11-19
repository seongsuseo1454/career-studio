// src/components/GlobalStyle.tsx

'use client'; // styled-jsx와 함께 사용하려면 반드시 'use client'를 명시해야 합니다.

import React from 'react';

export const GlobalStyle = () => (
  <style jsx global>{`
    @page { size: A4 portrait; margin: 12mm; }
    @media print {
      .no-print { display: none !important; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { box-shadow: none !important; }
      .page-break { break-after: page; page-break-after: always; }
      html, body { background: white !important; }
    }
    .page { width: 210mm; margin: 0 auto; }
    @keyframes fadeIn { from { opacity:0; transform: translateY(8px) } to { opacity:1; transform: translateY(0) } }
    .fade-in { animation: fadeIn .35s ease-out; }
  `}</style>
);