import { useCallback, useState } from 'react'
import type { Role, SlotId, Token } from './exercises'

const ROLE_LABELS: Record<Role, string> = {
  subject: 'subject',
  verb: 'predicate',
  directObject: 'direct object',
  indirectObject: 'indirect object',
  predicateNoun: 'predicate noun',
  predicateAdjective: 'predicate adjective',
  modifier: 'modifier',
  conjunction: 'conjunction',
  subjectModifier: 'subject modifier',
  verbModifier: 'verb modifier',
}

const POS_LABELS: Record<string, string> = {
  noun: 'noun',
  pronoun: 'pronoun',
  verb: 'verb',
  adjective: 'adjective',
  adverb: 'adverb',
  preposition: 'preposition',
  conjunction: 'conjunction',
  article: 'article',
  aux: 'helping verb',
}

export const buildTokenLabel = (token: Token, roles: Role[] | undefined) => {
  const roleText = roles?.map((role) => ROLE_LABELS[role] ?? role).join(' and ')
  const partsOfSpeech = token.pos.map((pos) => POS_LABELS[pos] ?? pos).join(', ')
  const pieces = [`token ${token.text}`]
  if (partsOfSpeech) pieces.push(partsOfSpeech)
  if (roleText) pieces.push(roleText)
  return pieces.join(', ')
}

export const buildSlotLabel = (slot: SlotId, accepts: Role[]) => {
  if (accepts.length === 0) {
    return 'Empty slot'
  }
  const preferred = accepts[0]
  const label = ROLE_LABELS[preferred] ?? preferred
  return `${label} slot`
}

export const getSlotDescription = (accepts: Role[]) => {
  if (accepts.includes('subject')) return 'Place the subject on the left side.'
  if (accepts.includes('verb')) return 'Place the predicate verb here.'
  if (accepts.includes('directObject')) return 'Direct objects sit to the right of the verb.'
  if (accepts.includes('predicateNoun') || accepts.includes('predicateAdjective')) {
    return 'Linking verbs connect to complements on this part of the line.'
  }
  if (accepts.includes('subjectModifier')) return 'Adjectives and articles lean under the subject.'
  if (accepts.includes('verbModifier')) return 'Adverbs lean under the verb.'
  return 'Drop a matching word here.'
}

export const useAnnouncer = () => {
  const [message, setMessage] = useState('')
  const announce = useCallback((text: string) => {
    setMessage(text)
  }, [])
  const region = (
    <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      {message}
    </div>
  )
  return { announce, region }
}
