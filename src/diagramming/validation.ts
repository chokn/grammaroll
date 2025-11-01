import type { GroundTruthMapping, Role, SlotId, Token } from './exercises'

export interface Placement {
  tokenId: string
  slotId: SlotId
}

export interface ValidationResult {
  correct: boolean
  missing: Placement[]
  extras: Placement[]
  tips: string[]
}

export interface ValidationOptions {
  tokens: Token[]
  roles: Record<string, Role[]>
}

const placementKey = (placement: Placement) => `${placement.tokenId}::${placement.slotId.path}`

const mappingMatches = (placements: Placement[], mapping: GroundTruthMapping) => {
  if (placements.length !== mapping.placements.length) return false
  const expectedKeys = new Set(mapping.placements.map(placementKey))
  return placements.every((placement) => expectedKeys.has(placementKey(placement)))
}

const ROLE_TIPS: Record<Role, string> = {
  subject: 'Subjects sit on the left side of the main line.',
  verb: 'The main verb belongs on the right side of the vertical bar.',
  directObject: 'Direct objects continue the main line to the right of the verb.',
  indirectObject: 'Indirect objects sit on a short slanted line under the verb.',
  predicateNoun: 'Predicate nouns rename the subject and share the main line after a linking verb.',
  predicateAdjective: 'Predicate adjectives describe the subject and follow linking verbs on the main line.',
  modifier: 'Modifiers lean diagonally off the word they describe.',
  conjunction: 'Conjunctions connect similar parts with a dotted line.',
  subjectModifier: 'Adjectives and articles lean below the subject they describe.',
  verbModifier: 'Adverbs lean below the verb they modify.',
}

const describePlacement = (token: Token | undefined, role: Role | undefined) => {
  if (!token) return 'Check the placement again.'
  if (!role) return `"${token.text}" needs to match its role on the diagram.`
  const roleTip = ROLE_TIPS[role]
  const label = role.replace(/([A-Z])/g, ' $1').toLowerCase()
  return `${roleTip} Try placing "${token.text}" in the ${label} slot.`
}

export function validate(
  placements: Placement[],
  answer: GroundTruthMapping,
  variants: GroundTruthMapping[] | undefined,
  options: ValidationOptions,
): ValidationResult {
  const { tokens, roles } = options
  const tokenMap = new Map(tokens.map((token) => [token.id, token]))
  const canonical = [answer, ...(variants ?? [])]

  const matchedVariant = canonical.find((mapping) => mappingMatches(placements, mapping))

  if (matchedVariant) {
    return {
      correct: true,
      missing: [],
      extras: [],
      tips: [],
    }
  }

  const expectedByToken = new Map(answer.placements.map((placement) => [placement.tokenId, placement.slotId.path]))
  const placedByToken = new Map(placements.map((placement) => [placement.tokenId, placement.slotId.path]))

  const missing: Placement[] = answer.placements.filter((placement) => {
    const placed = placedByToken.get(placement.tokenId)
    return placed !== placement.slotId.path
  })

  const extras: Placement[] = placements.filter((placement) => {
    const expectedSlot = expectedByToken.get(placement.tokenId)
    return expectedSlot !== placement.slotId.path
  })

  const tips: string[] = []

  const firstMisplaced = extras.find((placement) => expectedByToken.has(placement.tokenId))
  if (firstMisplaced) {
    const token = tokenMap.get(firstMisplaced.tokenId)
    const tokenRoles = roles[firstMisplaced.tokenId]
    const role = tokenRoles?.[0]
    tips.push(describePlacement(token, role))
  }

  if (tips.length === 0 && missing.length > 0) {
    const token = tokenMap.get(missing[0].tokenId)
    const tokenRoles = roles[missing[0].tokenId]
    const role = tokenRoles?.[0]
    tips.push(describePlacement(token, role))
  }

  if (tips.length === 0 && extras.length > 0) {
    const token = tokenMap.get(extras[0].tokenId)
    tips.push(`"${token?.text ?? 'This word'}" looks out of place. Double-check the slot label.`)
  }

  return {
    correct: false,
    missing,
    extras,
    tips,
  }
}
