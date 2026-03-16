import Script from 'next/script'

const Analytics = () => (
  <Script
    defer
    data-domain="hackathons.happyhacking.space"
    src="https://plausible.io/js/plausible.js"
  />
)

export default Analytics
