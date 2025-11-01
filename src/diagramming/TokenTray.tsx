import { memo, type CSSProperties } from 'react'
import { useDrag } from 'react-dnd'
import type { Role, Token } from './exercises'
import { buildTokenLabel } from './a11y'

export interface TokenTrayProps {
  tokens: Token[]
  placedTokenIds: Set<string>
  roles: Record<string, Role[]>
  selectedTokenId: string | null
  onSelectToken: (tokenId: string | null) => void
}

interface DragItem {
  tokenId: string
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
  const [{ isDragging }, dragRef] = useDrag({
    type: 'diagram-token',
    item: { tokenId: token.id } satisfies DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const handleClick = () => {
    onSelect(selected ? null : token.id)
  }

  return (
    <button
      ref={dragRef}
      type="button"
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(selected ? null : token.id)
        }
      }}
      aria-pressed={selected}
      aria-label={buildTokenLabel(token, roles)}
      style={{
        ...(selected ? selectedStyle : tokenStyle),
        opacity: isDragging ? 0.5 : 1,
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
