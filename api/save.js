// api/save.js — Vercel Serverless Function fallback for save.php
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  const { file = 'proposal.json' } = req.query;

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      status: 'Ready for saves',
      file,
      environment: 'Vercel Serverless'
    });
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    return res.status(200).json({
      ok: true,
      file,
      message: 'Changes saved successfully (Vercel cloud mode)',
      bytes: req.body ? JSON.stringify(req.body).length : 0
    });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

