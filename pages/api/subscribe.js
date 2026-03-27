export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, location, firstName } = req.body

  // Honeypot check: If firstName is filled, it's likely a bot
  if (firstName) {
    console.warn('Spam submission detected via honeypot')
    return res.status(200).json({ success: true }) // Silent success for bots
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const apiKey = process.env.LOOPS_API_KEY

  if (!apiKey) {
    console.error('LOOPS_API_KEY is not set in environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        location,
        source: 'Hackathons Website',
        userGroup: 'Hackathon Enthusiast'
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Loops.so API error:', data)
      return res.status(response.status).json({
        error: data.message || 'Something went wrong with the subscription service'
      })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
