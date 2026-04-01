export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const r = await fetch(
      'https://www.data.gouv.fr/api/1/datasets/r/c2539d1c-8531-4937-9cba-3bd8e9786cc5',
      { headers: { 'User-Agent': 'SqueezeRadar/1.0' } }
    );
    if (!r.ok) return res.status(502).json({ error: 'AMF fetch failed' });
    const csv = await r.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).send(csv);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
