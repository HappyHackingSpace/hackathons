import Error from 'next/error'
import Grouping from '../components/grouping'
import Regions from '../components/regions'
// import Signup from '../components/signup'
import { map, orderBy, find, kebabCase, startCase } from 'lodash'
import { getGroupingData } from '../lib/data'
import { Box } from 'theme-ui'

export default ({ name, events, emailStats }) => {
  if (!name || !events) return <Error statusCode={404} />
  return (
    <Grouping
      title={`High School Hackathons in ${name.replace(
        'USA',
        'United States'
      )}`}
      desc={`Find, register, and compete in ${events.length} student-led hackathons around ${name}.`}
      events={events}
      header={null}
      footer={
        <>
          {' '}
          <Box sx={{ mt: [3, 4] }}>
            {' '}
            <Regions showAll />{' '}
          </Box>{' '}
        </>
      }
    ></Grouping>
  )
}

const distance = (lat1, lon1, lat2, lon2) => {
  // https://www.geodatasource.com/developers/javascript
  const radlat1 = (Math.PI * lat1) / 180
  const radlat2 = (Math.PI * lat2) / 180
  const theta = lon1 - lon2
  const radtheta = (Math.PI * theta) / 180
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  return {
    miles: dist,
    kilometers: dist * 1.609344
  }
}

// Normalize Turkish characters to ASCII for accent-insensitive comparison
// ı→i, İ→i, ş→s, ç→c, ğ→g, ö→o, ü→u (and uppercase variants)
const normalizeTR = str =>
  (str || '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')

const cityMatch = (eventCity, target) =>
  normalizeTR(eventCity) === normalizeTR(target)

let regions = [
  {
    name: 'Diyarbakır',
    filter: event => cityMatch(event.city, 'Diyarbakır')
  }
]
regions = map(regions, region => ({ id: kebabCase(region.name), ...region }))

export const getStaticPaths = () => {
  const paths = map(map(regions, 'id'), id => ({
    params: { region: `list-of-hackathons-in-${id}` }
  }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps = async ({ params }) => {
  let { region } = params
  region = find(regions, ['id', region.replace('list-of-hackathons-in-', '')])
  let { name } = region
  let { events, emailStats } = await getGroupingData()
  events = events.filter(event => region.filter(event))
  events = orderBy(events, 'start', 'desc')
  return { props: { name, events, emailStats }, revalidate: 10 }
}
