const AIRTABLE_PAT = process.env.AIRTABLE_PAT
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID

const airtableHeaders = {
  Authorization: `Bearer ${AIRTABLE_PAT}`,
  'Content-Type': 'application/json'
}

const getAirtableRecords = async (filterFormula = '') => {
  const records = []
  let offset = null

  do {
    const params = new URLSearchParams()
    if (filterFormula) params.set('filterByFormula', filterFormula)
    if (offset) params.set('offset', offset)

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?${params.toString()}`
    const res = await fetch(url, { headers: airtableHeaders })
    const data = await res.json()

    if (!res.ok) throw new Error(data?.error?.message || 'Airtable fetch error')

    records.push(...(data.records || []))
    offset = data.offset || null
  } while (offset)

  return records
}

export const MODALITY = {
  IN_PERSON: 'in_person',
  VIRTUAL: 'online',
  HYBRID: 'hybrid'
}

// Normalize Airtable modality values to internal format
// Airtable may store: "In-person", "in_person", "Online", "online", "Virtual", "Hybrid", "hybrid"
const normalizeModality = raw => {
  if (!raw) return MODALITY.IN_PERSON
  const v = raw.toLowerCase().replace(/[^a-z]/g, '')
  if (v === 'online' || v === 'virtual') return MODALITY.VIRTUAL
  if (v === 'hybrid') return MODALITY.HYBRID
  return MODALITY.IN_PERSON
}

export const getEvents = async ({ upcoming } = { upcoming: false }) => {
  const records = await getAirtableRecords(`{Approved} = 1`)

  let events = records.map(record => {
    const f = record.fields
    return {
      id: record.id,
      name: f['Name'] || '',
      website: f['Website'] || '',
      start: f['Starts At'] || '',
      end: f['Ends At'] || '',
      createdAt: f['Submitted At'] || record.createdTime,
      logo: f['Logo']?.[0]?.url || '',
      banner: f['Banner']?.[0]?.url || '',
      city: f['City'] || '',
      state: f['Province'] || '',
      country: f['Country'] || '',
      countryCode: f['Country Code'] || '',
      latitude: f['Latitude'] || '',
      longitude: f['Longitude'] || '',
      virtual: normalizeModality(f['Modality']) === MODALITY.VIRTUAL,
      hybrid: normalizeModality(f['Modality']) === MODALITY.HYBRID,
      mlhAssociated: false,
      apac: f['APAC'] || false
    }
  })

  if (upcoming) {
    const now = new Date()
    events = events.filter(event => new Date(event.start) > now)
  }

  // Remove events missing required keys
  const requiredKeys = ['id', 'name', 'website', 'start', 'end']
  events = events.filter(e =>
    requiredKeys.every(key => typeof e[key] !== 'undefined' && e[key] !== '')
  )

  // Fill in undefined values with empty strings
  events = events.map(e => {
    Object.keys(e).forEach(key => {
      if (typeof e[key] === 'undefined') e[key] = ''
    })
    return e
  })

  return events
}

export const getEmailStats = async () => {
  // Stats are not tracked via Airtable — return empty for now
  return { countries: 0, cities: 0 }
}

export const getGroupingData = async () => ({
  events: (await getEvents()) || [],
  emailStats: (await getEmailStats()) || {}
})

export const createSubmission = async data => {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`

  // Extract lat/long from Google Maps URL if provided
  let latitude, longitude
  if (data.mapsUrl) {
    // Handles: https://www.google.com/maps/place/.../@37.9167,40.2167,15z/
    const coordMatch = data.mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (coordMatch) {
      latitude = parseFloat(coordMatch[1])
      longitude = parseFloat(coordMatch[2])
    }
    // Handles: https://www.google.com/maps?q=37.9167,40.2167
    if (!latitude) {
      const qMatch = data.mapsUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
      if (qMatch) {
        latitude = parseFloat(qMatch[1])
        longitude = parseFloat(qMatch[2])
      }
    }
  }

  const fields = {
    Name: data.name,
    Website: data.website,
    'Starts At': data.startsAt,
    'Ends At': data.endsAt,
    City: data.city || '',
    Province: data.province || '',
    Country: data.country || '',
    'Country Code': data.countryCode || '',
    Latitude: latitude || undefined,
    Longitude: longitude || undefined,
    Modality: data.modality || 'in_person',
    APAC: data.apac || false,
    Status: 'Pending',
    Approved: false
  }

  if (data.logoUrl) fields['Logo'] = [{ url: data.logoUrl }]
  if (data.bannerUrl) fields['Banner'] = [{ url: data.bannerUrl }]

  // Remove undefined fields
  Object.keys(fields).forEach(k => {
    if (fields[k] === undefined) delete fields[k]
  })

  const res = await fetch(url, {
    method: 'POST',
    headers: airtableHeaders,
    body: JSON.stringify({ fields })
  })

  const result = await res.json()
  if (!res.ok) throw new Error(result?.error?.message || 'Airtable write error')
  return result
}
