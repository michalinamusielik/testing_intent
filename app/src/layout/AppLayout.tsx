import { Box, Container, Tab, Tabs, Typography } from '@mui/material'
import { Link, Outlet, useLocation } from 'react-router-dom'

const tabs = [
  { label: 'Aktywności', path: '/' },
  { label: 'Ankieta', path: '/ankieta' },
]

export function AppLayout() {
  const location = useLocation()
  const currentPath = location.pathname === '/' ? '/' : location.pathname
  const activeIndex = tabs.findIndex((t) => t.path === currentPath)
  const value = activeIndex === -1 ? 0 : activeIndex

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="md" sx={{ pt: 3, pb: 0 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
            Dopasuj aktywność
          </Typography>
          <Tabs value={value} aria-label="Nawigacja">
            {tabs.map((t) => (
              <Tab
                key={t.path}
                label={t.label}
                component={Link}
                to={t.path}
                disableRipple
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
