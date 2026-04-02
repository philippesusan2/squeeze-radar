export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker required' });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=30d&interval=1d`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });

    if (!r.ok) {
      // Essayer query2 si query1 échoue
      const r2 = await fetch(url.replace('query1', 'query2'), {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!r2.ok) return res.status(502).json({ error: 'Yahoo fetch failed' });
      const data2 = await r2.json();
      res.setHeader('Cache-Control', 's-maxage=900');
      return res.status(200).json(data2);
    }

    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=900'); // cache 15min
    return res.status(200).json(data);

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
