export type WhereValue = 'indoor' | 'outdoor' | 'any'
export type SocialValue = 'solo' | 'duo' | 'group' | 'any'
export type EnergyValue = 'low' | 'medium' | 'high'
export type TimeValue = 'short' | 'medium' | 'long'
export type BudgetValue = 'free' | 'low' | 'medium' | 'high'
export type TagKey =
  | 'kreatywne'
  | 'fizyczne'
  | 'umyslowe'
  | 'relaks'
  | 'towarzyskie'

export type Answers = {
  where: WhereValue | null
  social: SocialValue | null
  energy: EnergyValue | null
  time: TimeValue | null
  budget: BudgetValue | null
  tags: TagKey[]
}

export const emptyAnswers: Answers = {
  where: null,
  social: null,
  energy: null,
  time: null,
  budget: null,
  tags: [],
}

export type QuestionOption<V extends string> = {
  value: V
  label: string
  hint?: string
}

export type Question =
  | {
      key: 'where'
      title: string
      subtitle?: string
      multi: false
      options: QuestionOption<WhereValue>[]
    }
  | {
      key: 'social'
      title: string
      subtitle?: string
      multi: false
      options: QuestionOption<SocialValue>[]
    }
  | {
      key: 'energy'
      title: string
      subtitle?: string
      multi: false
      options: QuestionOption<EnergyValue>[]
    }
  | {
      key: 'time'
      title: string
      subtitle?: string
      multi: false
      options: QuestionOption<TimeValue>[]
    }
  | {
      key: 'budget'
      title: string
      subtitle?: string
      multi: false
      options: QuestionOption<BudgetValue>[]
    }
  | {
      key: 'tags'
      title: string
      subtitle?: string
      multi: true
      options: QuestionOption<TagKey>[]
    }

export const QUESTIONS: Question[] = [
  {
    key: 'where',
    title: 'Gdzie?',
    subtitle: 'Gdzie wolisz spędzić ten czas.',
    multi: false,
    options: [
      { value: 'indoor', label: 'W pomieszczeniu', hint: 'W czterech ścianach' },
      { value: 'outdoor', label: 'Na zewnątrz', hint: 'Pod chmurką' },
      { value: 'any', label: 'Dowolnie', hint: 'Nie ma znaczenia' },
    ],
  },
  {
    key: 'social',
    title: 'Z kim?',
    subtitle: 'Solo czy w towarzystwie.',
    multi: false,
    options: [
      { value: 'solo', label: 'Solo', hint: 'Tylko ja' },
      { value: 'duo', label: 'We dwoje', hint: 'Partner lub przyjaciel' },
      { value: 'group', label: 'W grupie', hint: 'Ekipa 3+' },
      { value: 'any', label: 'Dowolnie', hint: 'Nie ma znaczenia' },
    ],
  },
  {
    key: 'energy',
    title: 'Ile energii?',
    subtitle: 'Jak bardzo chce Ci się ruszać.',
    multi: false,
    options: [
      { value: 'low', label: 'Niska', hint: 'Chill, bez wysiłku' },
      { value: 'medium', label: 'Średnia', hint: 'Trochę się poruszam' },
      { value: 'high', label: 'Wysoka', hint: 'Pełny gaz' },
    ],
  },
  {
    key: 'time',
    title: 'Ile czasu?',
    subtitle: 'Ile masz teraz wolnego.',
    multi: false,
    options: [
      { value: 'short', label: 'Krótko', hint: 'Mniej niż 1h' },
      { value: 'medium', label: 'Średnio', hint: '1–3h' },
      { value: 'long', label: 'Długo', hint: 'Więcej niż 3h' },
    ],
  },
  {
    key: 'budget',
    title: 'Budżet?',
    subtitle: 'Ile jesteś gotów/gotowa wydać.',
    multi: false,
    options: [
      { value: 'free', label: 'Zero', hint: 'Za darmo' },
      { value: 'low', label: 'Niski', hint: 'Kilka złotych' },
      { value: 'medium', label: 'Średni', hint: 'Do stówki' },
      { value: 'high', label: 'Wysoki', hint: 'Nie oszczędzam' },
    ],
  },
  {
    key: 'tags',
    title: 'Na co masz ochotę?',
    subtitle: 'Zaznacz wszystkie, które pasują.',
    multi: true,
    options: [
      { value: 'kreatywne', label: 'Kreatywne' },
      { value: 'fizyczne', label: 'Fizyczne' },
      { value: 'umyslowe', label: 'Umysłowe' },
      { value: 'relaks', label: 'Relaks' },
      { value: 'towarzyskie', label: 'Towarzyskie' },
    ],
  },
]

export const TAG_MAPPING: Record<TagKey, string[]> = {
  kreatywne: ['kreatywność', 'rękodzieło', 'fotografia', 'pisanie', 'refleksja'],
  fizyczne: ['sport', 'ruch', 'kondycja', 'zdrowie', 'adrenalina', 'wyzwanie'],
  umyslowe: ['wiedza', 'sztuka', 'kultura', 'książka', 'mindfulness'],
  relaks: ['relaks', 'spokój', 'rutyna'],
  towarzyskie: ['znajomi', 'rozmowa', 'wyjście', 'śmiech', 'gry', 'muzyka'],
}

export function buildMatchArgs(answers: Answers): {
  energy?: EnergyValue
  cost?: BudgetValue
  social?: Exclude<SocialValue, 'any'>
  location?: Exclude<WhereValue, 'any'>
  maxDurationMin?: number
  tags?: string[]
  limit?: number
} {
  const expandedTags = answers.tags.flatMap((t) => TAG_MAPPING[t])
  return {
    energy: answers.energy ?? undefined,
    cost: answers.budget ?? undefined,
    social:
      answers.social && answers.social !== 'any' ? answers.social : undefined,
    location:
      answers.where && answers.where !== 'any' ? answers.where : undefined,
    maxDurationMin:
      answers.time === 'short' ? 60 : answers.time === 'medium' ? 180 : undefined,
    tags: expandedTags.length > 0 ? expandedTags : undefined,
    limit: 10,
  }
}

export function computeMaxScore(args: ReturnType<typeof buildMatchArgs>): number {
  let max = 0
  if (args.energy) max += 3
  if (args.cost) max += 2
  if (args.social) max += 2
  if (args.location) max += 2
  if (args.maxDurationMin !== undefined) max += 1
  if (args.tags && args.tags.length > 0) max += args.tags.length
  return max || 1
}

export function isAnswered(answers: Answers, key: Question['key']): boolean {
  if (key === 'tags') return answers.tags.length > 0
  return answers[key] !== null
}
