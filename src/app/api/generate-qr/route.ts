function makeQRDataURL(text: string) {
  // 최소 QR 대용(실제 QR 라이브러리 없이 placeholder SVG로 대체)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg
SVG namespace
http://www.w3.org/2000/svg is an XML namespace, first defined in the Scalable Vector Graphics (SVG) 1.0 Specification and subsequently added to by SVG 1.1, SVG 1.2 and SVG 2. The SVG namespace is mutable ; names may be added over time by the W3C SVG Working Group by publication in W3C Technical Rep...
www.w3.org
' width='256' height='256'>
    <rect width='100%' height='100%' fill='#fff'/><rect x='16' y='16' width='224' height='224' fill='#000'/>
    <rect x='32' y='32' width='192' height='192' fill='#fff'/>
    <text x='50%' y='50%' font-size='10' text-anchor='middle' fill='#000'>QR</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function POST(req: Request) {
  // ... (이전 코드)

// 이곳부터 빨간 줄이 발생했던 부분의 수정본이야
  const { url } = await req.json().catch(()=>({ url: 'https://example.com' })); // 👈 이 줄!
  const shareUrl = url || 'https://example.com'; // 👈 이 줄!
  const qrUrl = makeQRDataURL(shareUrl);
  return Response.json({ qrUrl, shareUrl }, { status: 200 });
}