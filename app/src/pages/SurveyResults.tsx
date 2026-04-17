import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'

export type MatchResult = {
  _id: string
  title: string
  description: string
  category: string
  durationMin: number
  cost: string
  energy: string
  social: string
  location: string
  weather: string
  tags: string[]
  score: number
  reasons: string[]
}

type Props = {
  results: MatchResult[] | undefined
  maxScore: number
  onReset: () => void
}

function percentFor(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.min(100, Math.round((score / max) * 100))
}

function buildExportContent(results: MatchResult[], max: number): string {
  const lines: string[] = []
  lines.push('Dopasowane aktywności')
  lines.push('='.repeat(24))
  lines.push('')
  results.forEach((r, idx) => {
    const pct = percentFor(r.score, max)
    lines.push(`${idx + 1}. ${r.title} — ${pct}% dopasowania`)
    lines.push(r.description)
    lines.push('')
  })
  return lines.join('\n')
}

function downloadResults(results: MatchResult[], max: number) {
  const content = buildExportContent(results, max)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'dopasowane-aktywnosci.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function SurveyResults({ results, maxScore, onReset }: Props) {
  if (results === undefined) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Dopasowujemy aktywności…
        </Typography>
      </Box>
    )
  }

  const hasResults = results.length > 0

  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ mb: 0.5 }}>
        Twoje dopasowania
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {hasResults
          ? `Top ${results.length} aktywności dla Twoich odpowiedzi.`
          : 'Nie znaleźliśmy pasujących aktywności. Spróbuj innych odpowiedzi.'}
      </Typography>

      {hasResults && (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {results.map((r, idx) => {
            const pct = percentFor(r.score, maxScore)
            return (
              <Card key={r._id}>
                <CardContent sx={{ py: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h5" component="h3">
                      {idx + 1}. {r.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {pct}%
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 0.5, mb: 1.25 }}>
                    {r.description}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
                    }}
                  />
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      )}

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          disabled={!hasResults}
          onClick={() => downloadResults(results, maxScore)}
        >
          Pobierz wyniki
        </Button>
        <Button variant="outlined" onClick={onReset}>
          Wypełnij ponownie
        </Button>
      </Stack>
    </Box>
  )
}
