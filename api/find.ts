// api/find.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = process.env.API_UPSTREAM ?? 'http://3.36.53.174';

// 공통 CORS 헤더 (동일출처지만 JSON은 preflight가 뜹니다)
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 필요시 특정 도메인으로 교체
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  // ✅ 프리플라이트 허용
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const upstreamRes = await fetch(`${UPSTREAM}/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await upstreamRes.text();
    res.status(upstreamRes.status);
    res.setHeader('Content-Type', upstreamRes.headers.get('content-type') ?? 'application/json');
    return res.send(text);
  } catch (e) {
    return res.status(500).json({ error: 'Proxy error', detail: String(e) });
  }
}
