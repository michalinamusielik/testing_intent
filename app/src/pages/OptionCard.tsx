import { Box, ButtonBase, Typography } from '@mui/material'

type Props = {
  label: string
  hint?: string
  selected: boolean
  onClick: () => void
}

export function OptionCard({ label, hint, selected, onClick }: Props) {
  return (
    <ButtonBase
      onClick={onClick}
      focusRipple
      sx={(theme) => ({
        display: 'block',
        textAlign: 'left',
        width: '100%',
        px: 2,
        py: 1.75,
        borderRadius: 2,
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected
          ? 'rgba(35, 131, 226, 0.08)'
          : 'background.paper',
        boxShadow: selected
          ? `inset 0 0 0 1px ${theme.palette.primary.main}`
          : 'none',
        transition: 'border-color 120ms, background-color 120ms',
        '&:hover': {
          bgcolor: selected
            ? 'rgba(35, 131, 226, 0.12)'
            : 'action.hover',
          borderColor: selected ? 'primary.main' : 'text.secondary',
        },
      })}
    >
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: selected ? 'primary.main' : 'text.primary',
          }}
        >
          {label}
        </Typography>
        {hint && (
          <Typography variant="body2" sx={{ mt: 0.25 }}>
            {hint}
          </Typography>
        )}
      </Box>
    </ButtonBase>
  )
}
