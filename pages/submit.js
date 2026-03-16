import { useState } from 'react'
import Head from 'next/head'
import Meta from '@happyhackingspace/meta'
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  Label,
  Input,
  Select,
  Button,
  Spinner,
  Alert,
  Flex,
  Link
} from 'theme-ui'
import { CheckCircle, AlertTriangle } from 'react-feather'

const Field = ({ label, required, children, hint }) => (
  <Box>
    <Label sx={{ mb: 1, fontWeight: 'bold', fontSize: 1 }}>
      {label}
      {required && (
        <Text as="span" sx={{ color: 'red', ml: 1 }}>
          *
        </Text>
      )}
    </Label>
    {hint && (
      <Text sx={{ color: 'muted', fontSize: 0, mb: 1 }}>{hint}</Text>
    )}
    {children}
  </Box>
)

const inputSx = {
  bg: 'sunken',
  border: '1px solid',
  borderColor: 'border',
  borderRadius: 'default',
  '&:focus': { borderColor: 'primary', outline: 'none' }
}

const SectionHeading = ({ children }) => (
  <Heading
    as="h2"
    sx={{
      fontSize: [2, 3],
      mt: 4,
      mb: 3,
      pb: 2,
      borderBottom: '2px solid',
      borderColor: 'border',
      color: 'primary'
    }}
  >
    {children}
  </Heading>
)

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    website: '',
    startsAt: '',
    endsAt: '',
    logoUrl: '',
    bannerUrl: '',
    city: '',
    province: '',
    country: '',
    countryCode: '',
    mapsUrl: '',
    modality: 'in_person',
    apac: false
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const set = key => e =>
    setForm(f => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Meta
          as={Head}
          title="Submitted! — Happy Hacking Space Hackathons"
          description="Your hackathon submission has been received."
        />
        <Container sx={{ maxWidth: 'copyPlus', pt: [4, 5], textAlign: 'center' }}>
          <Box
            sx={{
              bg: 'sheet',
              borderRadius: 'extra',
              p: [4, 5],
              boxShadow: 'card',
              maxWidth: 480,
              mx: 'auto'
            }}
          >
            <Box sx={{ color: 'green', mb: 3 }}>
              <CheckCircle size={64} />
            </Box>
            <Heading variant="headline" sx={{ mb: 2 }}>
              Submission received! 🎉
            </Heading>
            <Text sx={{ color: 'muted', mb: 4 }}>
              Your hackathon will be reviewed and published on the list if approved.
              We usually get back within a few days.
            </Text>
            <Link href="/" sx={{ variant: 'buttons.primary', display: 'inline-block' }}>
              Back to Homepage
            </Link>
          </Box>
        </Container>
      </>
    )
  }

  return (
    <>
      <Meta
        as={Head}
        title="Submit a Hackathon — Happy Hacking Space"
        description="List your high school hackathon on Happy Hacking Space."
      />
      <Box sx={{ bg: 'sheet', borderBottom: '1px solid', borderColor: 'border', py: [3, 4] }}>
        <Container sx={{ maxWidth: 'copyPlus' }}>
          <Heading as="h1" variant="title" sx={{ color: 'primary', mb: 2 }}>
            Submit a Hackathon
          </Heading>
          <Text sx={{ color: 'muted', fontSize: 2 }}>
            Submit your high school hackathon to be listed on{' '}
            <Link href="/" sx={{ color: 'primary' }}>
              Happy Hacking Space
            </Link>
            . After review and approval, it will appear on the main listing.
          </Text>
        </Container>
      </Box>

      <Container sx={{ maxWidth: 'copyPlus', py: [3, 4] }}>
        <Box
          as="form"
          onSubmit={handleSubmit}
          sx={{ bg: 'sheet', borderRadius: 'extra', p: [3, 4], boxShadow: 'card' }}
        >
          {/* Basic Info */}
          <SectionHeading>Basic Information</SectionHeading>
          <Grid gap={3} columns={[1, 2]}>
            <Field label="Hackathon Name" required>
              <Input
                sx={inputSx}
                placeholder="Istanbul Hacks 2026"
                value={form.name}
                onChange={set('name')}
                required
              />
            </Field>
            <Field label="Website" required>
              <Input
                sx={inputSx}
                type="url"
                placeholder="https://istanbulhacks.com"
                value={form.website}
                onChange={set('website')}
                required
              />
            </Field>
            <Field label="Start Date & Time" required>
              <Input
                sx={inputSx}
                type="datetime-local"
                value={form.startsAt}
                onChange={set('startsAt')}
                required
              />
            </Field>
            <Field label="End Date & Time" required>
              <Input
                sx={inputSx}
                type="datetime-local"
                value={form.endsAt}
                onChange={set('endsAt')}
                required
              />
            </Field>
            <Field label="Format" required>
              <Select sx={inputSx} value={form.modality} onChange={set('modality')}>
                <option value="in_person">In-Person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </Select>
            </Field>
            <Field label="Region">
              <Flex sx={{ alignItems: 'center', gap: 2, mt: 2 }}>
                <input
                  type="checkbox"
                  id="apac"
                  checked={form.apac}
                  onChange={set('apac')}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <Label htmlFor="apac" sx={{ mb: 0, cursor: 'pointer', fontWeight: 'normal' }}>
                  This event is in the Asia-Pacific (APAC) region
                </Label>
              </Flex>
            </Field>
          </Grid>

          {/* Media */}
          <SectionHeading>Media</SectionHeading>
          <Grid gap={3} columns={[1, 2]}>
            <Field
              label="Logo URL"
              hint="128×128 px recommended. Upload to imgbb.com or imgur.com and paste the link."
            >
              <Input
                sx={inputSx}
                type="url"
                placeholder="https://..."
                value={form.logoUrl}
                onChange={set('logoUrl')}
              />
            </Field>
            <Field
              label="Banner URL"
              hint="1920×1080 px recommended. Used as the card background."
            >
              <Input
                sx={inputSx}
                type="url"
                placeholder="https://..."
                value={form.bannerUrl}
                onChange={set('bannerUrl')}
              />
            </Field>
          </Grid>

          {/* Location */}
          <SectionHeading>Location</SectionHeading>
          <Text sx={{ color: 'muted', fontSize: 1, mb: 3 }}>
            Skip location fields if your event is fully online.
          </Text>
          <Grid gap={3} columns={[1, 2]}>
            <Field label="City">
              <Input
                sx={inputSx}
                placeholder="Istanbul"
                value={form.city}
                onChange={set('city')}
              />
            </Field>
            <Field label="State / Province">
              <Input
                sx={inputSx}
                placeholder="Istanbul"
                value={form.province}
                onChange={set('province')}
              />
            </Field>
            <Field label="Country">
              <Input
                sx={inputSx}
                placeholder="Turkey"
                value={form.country}
                onChange={set('country')}
              />
            </Field>
            <Field label="Country Code" hint="2-letter ISO code (TR, US, GB...)">
              <Input
                sx={inputSx}
                placeholder="TR"
                maxLength={2}
                value={form.countryCode}
                onChange={e =>
                  setForm(f => ({ ...f, countryCode: e.target.value.toUpperCase() }))
                }
              />
            </Field>
            <Field
              label="Google Maps Link"
              hint="Open Google Maps, find your venue, copy the URL from the address bar."
            >
              <Input
                sx={inputSx}
                type="url"
                placeholder="https://www.google.com/maps/place/..."
                value={form.mapsUrl}
                onChange={set('mapsUrl')}
              />
            </Field>
          </Grid>

          {/* Error */}
          {status === 'error' && (
            <Alert
              variant="primary"
              sx={{ mt: 3, bg: 'sunken', color: 'red', alignItems: 'center', gap: 2 }}
            >
              <AlertTriangle size={18} />
              <Text>{errorMsg}</Text>
            </Alert>
          )}

          {/* Submit */}
          <Flex sx={{ mt: 4, justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              disabled={status === 'loading'}
              sx={{
                px: 4,
                py: 2,
                fontSize: 2,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer'
              }}
            >
              {status === 'loading' ? (
                <Spinner size={20} color="currentColor" />
              ) : (
                'Submit Hackathon →'
              )}
            </Button>
          </Flex>
        </Box>
      </Container>
    </>
  )
}
