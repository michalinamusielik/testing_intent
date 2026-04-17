import { Box, Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material'
import { useQuery } from 'convex/react'
import { anyApi } from 'convex/server'
import { tagColors, type TagColorKey } from '../theme'

type Activity = {
  _id: string
  title: string
  description: string
  category: string
  durationMin: number
  cost: 'free' | 'low' | 'medium' | 'high'
  energy: 'low' | 'medium' | 'high'
  social: 'solo' | 'duo' | 'group'
  location: 'indoor' | 'outdoor' | 'any'
  weather: 'any' | 'sunny' | 'rainy' | 'cold'
  tags: string[]
}

const categoryColor: Record<string, TagColorKey> = {
  outdoor: 'green',
  relax: 'purple',
  active: 'orange',
  social: 'pink',
  creative: 'yellow',
  culture: 'blue',
  food: 'red',
}

const energyColor: Record<Activity['energy'], TagColorKey> = {
  low: 'gray',
  medium: 'yellow',
  high: 'red',
}

const costColor: Record<Activity['cost'], TagColorKey> = {
  free: 'green',
  low: 'blue',
  medium: 'yellow',
  high: 'red',
}

const socialLabel: Record<Activity['social'], string> = {
  solo: 'solo',
  duo: 'we dwoje',
  group: 'grupa',
}

const locationLabel: Record<Activity['location'], string> = {
  indoor: 'w domu',
  outdoor: 'na zewnątrz',
  any: 'dowolnie',
}

const TAG_PALETTE: TagColorKey[] = ['blue', 'green', 'yellow', 'purple', 'orange', 'pink']

function tagHueForString(value: string): TagColorKey {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length]
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

function ColorChip({ label, color }: { label: string; color: TagColorKey }) {
  const c = tagColors[color]
  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    />
  )
}

function MetaChip({ label }: { label: string }) {
  const c = tagColors.gray
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{ bgcolor: 'transparent', color: c.text, border: `1px solid ${c.border}` }}
    />
  )
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
        >
          <Typography variant="h5" component="h3">
            {activity.title}
          </Typography>
          <ColorChip
            label={activity.category}
            color={categoryColor[activity.category] ?? 'gray'}
          />
        </Stack>
        <Typography variant="body2" sx={{ mt: 0.75 }}>
          {activity.description}
        </Typography>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.75 }}>
          <MetaChip label={formatDuration(activity.durationMin)} />
          <ColorChip label={activity.cost} color={costColor[activity.cost]} />
          <ColorChip label={`energia: ${activity.energy}`} color={energyColor[activity.energy]} />
          <MetaChip label={socialLabel[activity.social]} />
          <MetaChip label={locationLabel[activity.location]} />
        </Stack>
        {activity.tags.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
            {activity.tags.map((tag) => (
              <ColorChip key={tag} label={`#${tag}`} color={tagHueForString(tag)} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Skeleton variant="text" width="40%" height={28} />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="70%" />
        <Stack direction="row" sx={{ gap: 0.75, mt: 1.5 }}>
          <Skeleton variant="rounded" width={64} height={22} />
          <Skeleton variant="rounded" width={52} height={22} />
          <Skeleton variant="rounded" width={80} height={22} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export function Aktywnosci() {
  const activities = useQuery(anyApi.activities.list) as Activity[] | undefined
  const isLoading = activities === undefined

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 2 }}
      >
        <Typography variant="h4" component="h2">
          Aktywności
        </Typography>
        {!isLoading && (
          <Typography variant="body2">
            {activities.length} {activities.length === 1 ? 'pozycja' : 'pozycji'}
          </Typography>
        )}
      </Stack>

      {isLoading ? (
        <Stack spacing={1.25}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Stack>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
              Brak aktywności
            </Typography>
            <Typography variant="body2">
              Uruchom seed w Convex (<code>seedActivities</code>), aby zobaczyć listę propozycji.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.25}>
          {activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </Stack>
      )}
    </Box>
  )
}
