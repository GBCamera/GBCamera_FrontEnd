// api/find.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTREAM = process.env.API_UPSTREAM ?? 'http://3.36.86.11';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 프론트에서 온 JSON 바디를 그대로 백엔드로 전달
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
