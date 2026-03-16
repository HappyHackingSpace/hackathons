export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-revalidate-secret'] || req.query.secret

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ error: 'Invalid secret' })
  }

  try {
    await res.revalidate('/')
    await res.revalidate('/map')
    console.log('Revalidated: / and /map')
    return res.status(200).json({ revalidated: true, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('Revalidation error:', err)
    return res.status(500).json({ error: err.message })
  }
}
