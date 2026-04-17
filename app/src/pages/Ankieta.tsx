import { Box, Typography } from '@mui/material'

export function Ankieta() {
  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
        Ankieta
      </Typography>
      <Typography variant="body2">
        Formularz ankiety pojawi się tutaj.
      </Typography>
    </Box>
  )
}
