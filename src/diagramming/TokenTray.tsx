import { memo, type CSSProperties } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Role, Token } from './exercises'
import { buildTokenLabel } from './a11y'

export interface TokenTrayProps {
  tokens: Token[]
  placedTokenIds: Set<string>
  roles: Record<string, Role[]>
  selectedTokenId: string | null
  onSelectToken: (tokenId: string | null) => void
}

const trayStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '12px',
  border: '1px solid #d0d5dd',
  borderRadius: '8px',
  background: '#f8fafc',
}

const tokenStyle: CSSProperties = {
  padding: '8px 12px',
  borderRadius: '999px',
  border: '1px solid #cbd5f5',
  background: '#fff',
  fontSize: '0.95rem',
  cursor: 'grab',
  outlineOffset: '2px',
}

const selectedStyle: CSSProperties = {
  ...tokenStyle,
  borderColor: '#2563eb',
  boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.3)',
}

const TokenButton = memo(function TokenButton({
  token,
  roles,
  selected,
  onSelect,
}: {
  token: Token
  roles: Role[] | undefined
  selected: boolean
  onSelect: (tokenId: string | null) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: token.id,
    data: { tokenId: token.id },
  })

  const handleClick = () => {
    onSelect(selected ? null : token.id)
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(selected ? null : token.id)
        }
      }}
      {...listeners}
      {...attributes}
      aria-pressed={selected}
      aria-label={buildTokenLabel(token, roles)}
      style={{
        ...(selected ? selectedStyle : tokenStyle),
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        transition: isDragging ? 'none' : undefined,
      }}
    >
      {token.text}
    </button>
  )
})

const TokenTray = ({ tokens, placedTokenIds, roles, selectedTokenId, onSelectToken }: TokenTrayProps) => {
  const available = tokens.filter((token) => !placedTokenIds.has(token.id))
  return (
    <div>
      <div style={{ fontSize: '0.85rem', marginBottom: 4, color: '#475467' }}>Words to place</div>
      <div style={trayStyle} role="list">
        {available.map((token) => (
          <div role="listitem" key={token.id}>
            <TokenButton
              token={token}
              roles={roles[token.id]}
              selected={selectedTokenId === token.id}
              onSelect={onSelectToken}
            />
          </div>
        ))}
        {available.length === 0 && (
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>All words placed! Double-check the diagram.</div>
        )}
      </div>
    </div>
  )
}

export default memo(TokenTray)
