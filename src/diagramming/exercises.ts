export type PartOfSpeech =
  | 'noun'
  | 'pronoun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'article'
  | 'aux'

export type Role =
  | 'subject'
  | 'verb'
  | 'directObject'
  | 'indirectObject'
  | 'predicateNoun'
  | 'predicateAdjective'
  | 'modifier'
  | 'conjunction'
  | 'subjectModifier'
  | 'verbModifier'

export interface Token {
  id: string
  text: string
  pos: PartOfSpeech[]
}

export interface SlotId {
  path: string
}

export interface DiagramSpec {
  nodes: Array<
    | { id: string; type: 'spine'; x: number; y: number; w: number }
    | { id: string; type: 'bar'; x: number; y: number; h: number }
    | { id: string; type: 'line'; x: number; y: number; w: number; h: number }
    | { id: string; type: 'slot'; x: number; y: number; w: number; h: number; slotId: SlotId }
    | { id: string; type: 'join'; x: number; y: number; w: number; h: number }
  >
  constraints: Array<{ slotId: SlotId; accepts: Role[] }>
}

export interface GroundTruthMapping {
  placements: Array<{ tokenId: string; slotId: SlotId }>
}

export interface Exercise {
  id: string
  level: 1 | 2 | 3
  sentence: string
  tokens: Token[]
  roles: Record<string, Role[]>
  diagram: DiagramSpec
  answer: GroundTruthMapping
  acceptedVariants?: GroundTruthMapping[]
  teachingNotes?: string[]
}

export interface LevelInfo {
  id: 1 | 2 | 3
  title: string
  description: string
  example: string
}

const levelInfo: LevelInfo[] = [
  {
    id: 1,
    title: 'Level 1',
    description: 'Identify the simple subject and simple predicate (main verb).',
    example: 'Birds | sing',
  },
  {
    id: 2,
    title: 'Level 2',
    description: 'Add direct objects or predicate adjectives/nouns to the main line.',
    example: 'Eleanor | reads | books',
  },
  {
    id: 3,
    title: 'Level 3',
    description: 'Place modifiers like adjectives and adverbs on diagonal lines.',
    example: 'The quick fox | jumped',
  },
]

const slotId = (path: string): SlotId => ({ path })

const baseSpineNodes = () => [
  { id: 'spine', type: 'spine', x: 60, y: 140, w: 320 } as const,
  { id: 'divider', type: 'bar', x: 200, y: 108, h: 64 } as const,
  { id: 'slot-subject', type: 'slot', x: 80, y: 108, w: 100, h: 46, slotId: slotId('spine.subject') } as const,
  { id: 'slot-verb', type: 'slot', x: 220, y: 108, w: 100, h: 46, slotId: slotId('spine.verb') } as const,
]

const complementNodes = () => [
  { id: 'divider-complement', type: 'bar', x: 320, y: 118, h: 54 } as const,
  { id: 'slot-complement', type: 'slot', x: 340, y: 108, w: 90, h: 46, slotId: slotId('spine.complement') } as const,
]

const subjectModifierNodes = () => [
  { id: 'subject-mod-line-0', type: 'line', x: 120, y: 154, w: 92, h: 192 } as const,
  { id: 'subject-mod-slot-0', type: 'slot', x: 70, y: 188, w: 90, h: 40, slotId: slotId('spine.subject.mod[0]') } as const,
  { id: 'subject-mod-line-1', type: 'line', x: 150, y: 160, w: 120, h: 205 } as const,
  { id: 'subject-mod-slot-1', type: 'slot', x: 110, y: 202, w: 90, h: 40, slotId: slotId('spine.subject.mod[1]') } as const,
]

const verbModifierNodes = () => [
  { id: 'verb-mod-line-0', type: 'line', x: 260, y: 154, w: 300, h: 194 } as const,
  { id: 'verb-mod-slot-0', type: 'slot', x: 300, y: 188, w: 100, h: 40, slotId: slotId('spine.verb.mod[0]') } as const,
]

const baseConstraints = () => [
  { slotId: slotId('spine.subject'), accepts: ['subject'] as Role[] },
  { slotId: slotId('spine.verb'), accepts: ['verb'] as Role[] },
]

const complementConstraints = () => [
  {
    slotId: slotId('spine.complement'),
    accepts: ['directObject', 'predicateAdjective', 'predicateNoun'],
  },
]

const subjectModifierConstraints = () => [
  {
    slotId: slotId('spine.subject.mod[0]'),
    accepts: ['modifier', 'subjectModifier'],
  },
  {
    slotId: slotId('spine.subject.mod[1]'),
    accepts: ['modifier', 'subjectModifier'],
  },
]

const verbModifierConstraints = () => [
  {
    slotId: slotId('spine.verb.mod[0]'),
    accepts: ['modifier', 'verbModifier'],
  },
]

const exercises: Exercise[] = [
  // Level 1
  {
    id: 'l1-birds-sing',
    level: 1,
    sentence: 'Birds sing.',
    tokens: [
      { id: 'birds', text: 'Birds', pos: ['noun'] },
      { id: 'sing', text: 'sing', pos: ['verb'] },
    ],
    roles: {
      birds: ['subject'],
      sing: ['verb'],
    },
    diagram: {
      nodes: baseSpineNodes(),
      constraints: baseConstraints(),
    },
    answer: {
      placements: [
        { tokenId: 'birds', slotId: slotId('spine.subject') },
        { tokenId: 'sing', slotId: slotId('spine.verb') },
      ],
    },
    teachingNotes: ['Point out that plural subjects still use the base subject slot.'],
  },
  {
    id: 'l1-eleanor-reads',
    level: 1,
    sentence: 'Eleanor reads.',
    tokens: [
      { id: 'eleanor', text: 'Eleanor', pos: ['noun'] },
      { id: 'reads', text: 'reads', pos: ['verb'] },
    ],
    roles: {
      eleanor: ['subject'],
      reads: ['verb'],
    },
    diagram: {
      nodes: baseSpineNodes(),
      constraints: baseConstraints(),
    },
    answer: {
      placements: [
        { tokenId: 'eleanor', slotId: slotId('spine.subject') },
        { tokenId: 'reads', slotId: slotId('spine.verb') },
      ],
    },
  },
  {
    id: 'l1-children-laugh',
    level: 1,
    sentence: 'Children laugh.',
    tokens: [
      { id: 'children', text: 'Children', pos: ['noun'] },
      { id: 'laugh', text: 'laugh', pos: ['verb'] },
    ],
    roles: {
      children: ['subject'],
      laugh: ['verb'],
    },
    diagram: {
      nodes: baseSpineNodes(),
      constraints: baseConstraints(),
    },
    answer: {
      placements: [
        { tokenId: 'children', slotId: slotId('spine.subject') },
        { tokenId: 'laugh', slotId: slotId('spine.verb') },
      ],
    },
  },
  {
    id: 'l1-waves-crash',
    level: 1,
    sentence: 'Waves crash.',
    tokens: [
      { id: 'waves', text: 'Waves', pos: ['noun'] },
      { id: 'crash', text: 'crash', pos: ['verb'] },
    ],
    roles: {
      waves: ['subject'],
      crash: ['verb'],
    },
    diagram: {
      nodes: baseSpineNodes(),
      constraints: baseConstraints(),
    },
    answer: {
      placements: [
        { tokenId: 'waves', slotId: slotId('spine.subject') },
        { tokenId: 'crash', slotId: slotId('spine.verb') },
      ],
    },
  },
  // Level 2
  {
    id: 'l2-eleanor-reads-books',
    level: 2,
    sentence: 'Eleanor reads books.',
    tokens: [
      { id: 'eleanor', text: 'Eleanor', pos: ['noun'] },
      { id: 'reads', text: 'reads', pos: ['verb'] },
      { id: 'books', text: 'books', pos: ['noun'] },
    ],
    roles: {
      eleanor: ['subject'],
      reads: ['verb'],
      books: ['directObject'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...complementNodes()],
      constraints: [...baseConstraints(), ...complementConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'eleanor', slotId: slotId('spine.subject') },
        { tokenId: 'reads', slotId: slotId('spine.verb') },
        { tokenId: 'books', slotId: slotId('spine.complement') },
      ],
    },
  },
  {
    id: 'l2-copper-valuable',
    level: 2,
    sentence: 'Copper is valuable.',
    tokens: [
      { id: 'copper', text: 'Copper', pos: ['noun'] },
      { id: 'is', text: 'is', pos: ['verb', 'aux'] },
      { id: 'valuable', text: 'valuable', pos: ['adjective'] },
    ],
    roles: {
      copper: ['subject'],
      is: ['verb'],
      valuable: ['predicateAdjective'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...complementNodes()],
      constraints: [...baseConstraints(), ...complementConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'copper', slotId: slotId('spine.subject') },
        { tokenId: 'is', slotId: slotId('spine.verb') },
        { tokenId: 'valuable', slotId: slotId('spine.complement') },
      ],
    },
  },
  {
    id: 'l2-dogs-chase-cats',
    level: 2,
    sentence: 'Dogs chase cats.',
    tokens: [
      { id: 'dogs', text: 'Dogs', pos: ['noun'] },
      { id: 'chase', text: 'chase', pos: ['verb'] },
      { id: 'cats', text: 'cats', pos: ['noun'] },
    ],
    roles: {
      dogs: ['subject'],
      chase: ['verb'],
      cats: ['directObject'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...complementNodes()],
      constraints: [...baseConstraints(), ...complementConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'dogs', slotId: slotId('spine.subject') },
        { tokenId: 'chase', slotId: slotId('spine.verb') },
        { tokenId: 'cats', slotId: slotId('spine.complement') },
      ],
    },
  },
  {
    id: 'l2-friends-helpers',
    level: 2,
    sentence: 'Friends are helpers.',
    tokens: [
      { id: 'friends', text: 'Friends', pos: ['noun'] },
      { id: 'are', text: 'are', pos: ['verb'] },
      { id: 'helpers', text: 'helpers', pos: ['noun'] },
    ],
    roles: {
      friends: ['subject'],
      are: ['verb'],
      helpers: ['predicateNoun'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...complementNodes()],
      constraints: [...baseConstraints(), ...complementConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'friends', slotId: slotId('spine.subject') },
        { tokenId: 'are', slotId: slotId('spine.verb') },
        { tokenId: 'helpers', slotId: slotId('spine.complement') },
      ],
    },
    acceptedVariants: [
      {
        placements: [
          { tokenId: 'friends', slotId: slotId('spine.subject') },
          { tokenId: 'are', slotId: slotId('spine.verb') },
          { tokenId: 'helpers', slotId: slotId('spine.complement') },
        ],
      },
    ],
  },
  // Level 3
  {
    id: 'l3-quick-fox-jumped',
    level: 3,
    sentence: 'The quick fox jumped.',
    tokens: [
      { id: 'the', text: 'The', pos: ['article'] },
      { id: 'quick', text: 'quick', pos: ['adjective'] },
      { id: 'fox', text: 'fox', pos: ['noun'] },
      { id: 'jumped', text: 'jumped', pos: ['verb'] },
    ],
    roles: {
      the: ['modifier', 'subjectModifier'],
      quick: ['modifier', 'subjectModifier'],
      fox: ['subject'],
      jumped: ['verb'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...subjectModifierNodes()],
      constraints: [...baseConstraints(), ...subjectModifierConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'fox', slotId: slotId('spine.subject') },
        { tokenId: 'jumped', slotId: slotId('spine.verb') },
        { tokenId: 'the', slotId: slotId('spine.subject.mod[0]') },
        { tokenId: 'quick', slotId: slotId('spine.subject.mod[1]') },
      ],
    },
    acceptedVariants: [
      {
        placements: [
          { tokenId: 'fox', slotId: slotId('spine.subject') },
          { tokenId: 'jumped', slotId: slotId('spine.verb') },
          { tokenId: 'quick', slotId: slotId('spine.subject.mod[0]') },
          { tokenId: 'the', slotId: slotId('spine.subject.mod[1]') },
        ],
      },
    ],
  },
  {
    id: 'l3-eleanor-carefully-writes',
    level: 3,
    sentence: 'Eleanor carefully writes.',
    tokens: [
      { id: 'eleanor', text: 'Eleanor', pos: ['noun'] },
      { id: 'carefully', text: 'carefully', pos: ['adverb'] },
      { id: 'writes', text: 'writes', pos: ['verb'] },
    ],
    roles: {
      eleanor: ['subject'],
      carefully: ['modifier', 'verbModifier'],
      writes: ['verb'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...verbModifierNodes()],
      constraints: [...baseConstraints(), ...verbModifierConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'eleanor', slotId: slotId('spine.subject') },
        { tokenId: 'writes', slotId: slotId('spine.verb') },
        { tokenId: 'carefully', slotId: slotId('spine.verb.mod[0]') },
      ],
    },
  },
  {
    id: 'l3-bright-flowers-bloom',
    level: 3,
    sentence: 'Bright flowers bloom.',
    tokens: [
      { id: 'bright', text: 'Bright', pos: ['adjective'] },
      { id: 'flowers', text: 'flowers', pos: ['noun'] },
      { id: 'bloom', text: 'bloom', pos: ['verb'] },
    ],
    roles: {
      bright: ['modifier', 'subjectModifier'],
      flowers: ['subject'],
      bloom: ['verb'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...subjectModifierNodes()],
      constraints: [...baseConstraints(), ...subjectModifierConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'flowers', slotId: slotId('spine.subject') },
        { tokenId: 'bloom', slotId: slotId('spine.verb') },
        { tokenId: 'bright', slotId: slotId('spine.subject.mod[0]') },
      ],
    },
  },
  {
    id: 'l3-small-birds-chirped-loudly',
    level: 3,
    sentence: 'The small birds chirped loudly.',
    tokens: [
      { id: 'the', text: 'The', pos: ['article'] },
      { id: 'small', text: 'small', pos: ['adjective'] },
      { id: 'birds', text: 'birds', pos: ['noun'] },
      { id: 'chirped', text: 'chirped', pos: ['verb'] },
      { id: 'loudly', text: 'loudly', pos: ['adverb'] },
    ],
    roles: {
      the: ['modifier', 'subjectModifier'],
      small: ['modifier', 'subjectModifier'],
      birds: ['subject'],
      chirped: ['verb'],
      loudly: ['modifier', 'verbModifier'],
    },
    diagram: {
      nodes: [...baseSpineNodes(), ...subjectModifierNodes(), ...verbModifierNodes()],
      constraints: [...baseConstraints(), ...subjectModifierConstraints(), ...verbModifierConstraints()],
    },
    answer: {
      placements: [
        { tokenId: 'birds', slotId: slotId('spine.subject') },
        { tokenId: 'chirped', slotId: slotId('spine.verb') },
        { tokenId: 'the', slotId: slotId('spine.subject.mod[0]') },
        { tokenId: 'small', slotId: slotId('spine.subject.mod[1]') },
        { tokenId: 'loudly', slotId: slotId('spine.verb.mod[0]') },
      ],
    },
    acceptedVariants: [
      {
        placements: [
          { tokenId: 'birds', slotId: slotId('spine.subject') },
          { tokenId: 'chirped', slotId: slotId('spine.verb') },
          { tokenId: 'small', slotId: slotId('spine.subject.mod[0]') },
          { tokenId: 'the', slotId: slotId('spine.subject.mod[1]') },
          { tokenId: 'loudly', slotId: slotId('spine.verb.mod[0]') },
        ],
      },
    ],
  },
]

export const LEVELS = levelInfo

export const EXERCISES = exercises

export const getExercisesByLevel = (level: 1 | 2 | 3) =>
  EXERCISES.filter((ex) => ex.level === level)
