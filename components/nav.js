import { ArrowLeft, Moon, GitHub } from 'react-feather'
import {
  Box,
  Container,
  IconButton,
  Button,
  Image,
  Text,
  Link as A,
  useColorMode
} from 'theme-ui'
import { useRouter } from 'next/router'
import Link from 'next/link'

const NavButton = ({ sx, ...props }) => (
  <IconButton
    {...props}
    sx={{
      color: 'red',
      borderRadius: 'circle',
      transition: 'box-shadow .125s ease-in-out',
      ':hover,:focus': {
        boxShadow: '0 0 0 2px',
        outline: 'none'
      },
      ...sx
    }}
  />
)

const BackButton = ({ to = '/', text = 'All Hackathons' }) => (
  <Link href={to} passHref>
    <NavButton
      as="a"
      title={to === '/' ? 'Back to homepage' : 'Back'}
      sx={{ display: 'flex', width: 'auto', pr: 2 }}
    >
      <ArrowLeft />
      {text}
    </NavButton>
  </Link>
)

const Flag = () => (
  <A
    href="https://happyhackingspace.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Happy Hacking Space homepage"
    sx={{
      lineHeight: 0,
      display: 'block',
      flexShrink: 0,
      transformOrigin: 'top left',
      transition: '0.2s cubic-bezier(0.375, 0, 0.675, 1) transform',
      ':hover,:focus': {
        animation: 'waveFlag 0.5s linear infinite alternate'
      },
      '@keyframes waveFlag': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(-5deg)' }
      }
    }}
  >
    <Image
      src="https://assets.happyhacking.space/flag-standalone.svg"
      alt="Happy Hacking Space"
      sx={{ width: [96, 120], height: 'auto' }}
    />
  </A>
)

const ColorSwitcher = props => {
  const [mode, setMode] = useColorMode()
  return (
    <NavButton
      {...props}
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      title="Reverse color scheme"
    >
      <Moon size={24} />
    </NavButton>
  )
}

export default ({app = false}) => {
  const router = useRouter()
  const home = router.pathname === '/'
  return (
    <Box
      as="nav"
      sx={{
        bg: home ? 'none' : 'sheet',
        color: 'primary',
        py: 3,
        display: home && app ? 'none' : 'block'
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          pr: 2,
          a: {
            fontSize: 1,
            color: 'primary',
            textDecoration: 'none',
            mr: [3, 4]
          }
        }}
      >
        {!home ? <BackButton /> : <Flag />}
        <Button
          as="a"
          variant="outline"
          href="/submit"
          aria-label="Apply to list your hackathon"
          sx={{
            width: 'auto',
            ml: 'auto',
            boxShadow: 'none !important',
            py: 1,
            px: 3
          }}
        >
          <Text as="span" sx={{ display: ['block', 'none'] }}>
            Submit
          </Text>
          <Text as="span" sx={{ display: ['none', 'block'] }}>
            Add Your Event
          </Text>
        </Button>
        <NavButton
          as="a"
          href="https://github.com/happyhackingspace/hackathons"
          aria-label="View source code on GitHub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub size={24} />
        </NavButton>
        <ColorSwitcher />
      </Container>
    </Box>
  )
}
