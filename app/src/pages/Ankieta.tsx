import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from 'convex/react'
import { anyApi } from 'convex/server'
import {
  buildMatchArgs,
  computeMaxScore,
  emptyAnswers,
  isAnswered,
  QUESTIONS,
  type Answers,
  type TagKey,
} from './surveyConfig'
import { OptionCard } from './OptionCard'
import { SurveyResults, type MatchResult } from './SurveyResults'

export function Ankieta() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [submitted, setSubmitted] = useState(false)

  const totalSteps = QUESTIONS.length
  const current = QUESTIONS[step]

  const matchArgs = useMemo(() => buildMatchArgs(answers), [answers])
  const maxScore = useMemo(() => computeMaxScore(matchArgs), [matchArgs])
  const results = useQuery(
    anyApi.activities.match,
    submitted ? matchArgs : 'skip',
  ) as MatchResult[] | undefined

  function handleSelect(key: (typeof QUESTIONS)[number]['key'], value: string) {
    setAnswers((prev) => {
      if (key === 'tags') {
        const tag = value as TagKey
        const has = prev.tags.includes(tag)
        return {
          ...prev,
          tags: has ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
        }
      }
      return { ...prev, [key]: value } as Answers
    })
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      setSubmitted(true)
    }
  }

  function handleBack() {
    if (submitted) {
      setSubmitted(false)
      return
    }
    if (step > 0) setStep(step - 1)
  }

  function handleReset() {
    setAnswers(emptyAnswers)
    setStep(0)
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <SurveyResults
        results={results}
        maxScore={maxScore}
        onReset={handleReset}
      />
    )
  }

  const canAdvance = isAnswered(answers, current.key)
  const progress = ((step + (canAdvance ? 1 : 0)) / totalSteps) * 100

  return (
    <Box>
      <Typography variant="h4" component="h2" sx={{ mb: 0.5 }}>
        Ankieta
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Krok {step + 1} z {totalSteps}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          borderRadius: 2,
          mb: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
        }}
      />

      <Typography variant="h3" component="h3" sx={{ mb: 0.5 }}>
        {current.title}
      </Typography>
      {current.subtitle && (
        <Typography variant="body2" sx={{ mb: 3 }}>
          {current.subtitle}
        </Typography>
      )}

      <Stack spacing={1.25} sx={{ mb: 4 }}>
        {current.options.map((opt) => {
          const selected =
            current.key === 'tags'
              ? answers.tags.includes(opt.value as TagKey)
              : answers[current.key] === opt.value
          return (
            <OptionCard
              key={opt.value}
              label={opt.label}
              hint={opt.hint}
              selected={selected}
              onClick={() => handleSelect(current.key, opt.value)}
            />
          )
        })}
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'space-between' }}>
        <Button variant="text" onClick={handleBack} disabled={step === 0}>
          Wstecz
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!canAdvance}
        >
          {step === totalSteps - 1 ? 'Pokaż wyniki' : 'Dalej'}
        </Button>
      </Stack>
    </Box>
  )
}
