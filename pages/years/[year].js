import Error from 'next/error'
import Grouping from '../../components/grouping'
import Years from '../../components/years'
import { map, filter, orderBy, startsWith, split, first, uniq } from 'lodash'
import { getEvents } from '../../lib/data'

export default ({ year, events }) => {
  if (!year || !events) return <Error statusCode={404} />
  return (
    <Grouping
      title={`${year} High School Hackathons`}
      desc={`Browse all ${events.length} hackathons for high schoolers ${
        new Date().getFullYear().toString() === year ? 'in' : 'from'
      } ${year}.`}
      events={events}
    >
      <Years showAll />
    </Grouping>
  )
}

export const getStaticPaths = async () => {
  // Always pre-generate paths for 2024 up to current year
  const currentYear = new Date().getFullYear()
  const fixedYears = []
  for (let y = 2024; y <= currentYear; y++) fixedYears.push(String(y))

  // Also add any years found in existing events
  let events = await getEvents()
  let starts = map(events, 'start')
  starts = map(starts, start => first(split(start, '-')))
  const eventYears = uniq(starts).filter(Boolean)

  const allYears = uniq([...fixedYears, ...eventYears])
  const paths = map(allYears, year => ({ params: { year } }))

  // fallback: 'blocking' — unknown years are rendered on-demand (no 404)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps = async ({ params }) => {
  const { year } = params
  let events = await getEvents()
  events = filter(events, (e) => startsWith(e.start, year))
  events = orderBy(events, 'start')
  return { props: { year, events }, revalidate: 10 }
}
