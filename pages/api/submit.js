import { createSubmission } from '../../lib/data'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const record = await createSubmission(req.body)
    return res.status(200).json({ success: true, id: record.id })
  } catch (err) {
    console.error('Submit error:', err)
    return res.status(500).json({ error: err.message })
  }
}
