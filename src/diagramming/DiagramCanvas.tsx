import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useDrop } from 'react-dnd'
import type { DiagramSpec, Role, SlotId, Token } from './exercises'
import type { Placement } from './validation'
import { buildSlotLabel, getSlotDescription } from './a11y'

export type SlotStatus = 'default' | 'correct' | 'incorrect'

export interface DiagramCanvasProps {
  spec: DiagramSpec
  placements: Placement[]
  tokens: Token[]
  roles: Record<string, Role[]>
  highlightedSlots: Set<string>
  statusBySlot: Map<string, SlotStatus>
  onDropToken: (tokenId: string, slot: SlotId) => void
  onClearSlot: (slot: SlotId) => void
  selectedTokenId: string | null
  announce: (message: string) => void
}

interface DragItem {
  tokenId: string
}

const containerStyle: CSSProperties = {
  border: '1px solid #d0d5dd',
  borderRadius: '8px',
  background: '#fff',
  padding: '12px',
  position: 'relative',
  minHeight: 260,
}

const textStyle: CSSProperties = {
  fontFamily: 'Georgia, serif',
  fill: '#0f172a',
  fontSize: '18px',
}

const strokeBase = '#94a3b8'

const slotFill = '#f8fafc'

const highlightFill = '#fef3c7'

const correctFill = '#dcfce7'

const incorrectFill = '#fee2e2'

const useConstraintMap = (spec: DiagramSpec) =>
  useMemo(() => new Map(spec.constraints.map((constraint) => [constraint.slotId.path, constraint.accepts])), [spec])

const buildPlacementMap = (placements: Placement[]) =>
  new Map(placements.map((placement) => [placement.slotId.path, placement]))

const SlotGroup = ({
  node,
  accepts,
  placement,
  token,
  highlight,
  status,
  onDropToken,
  onClearSlot,
  canAccept,
  selectedTokenId,
  announce,
}: {
  node: Extract<DiagramSpec['nodes'][number], { type: 'slot' }>
  accepts: Role[]
  placement: Placement | undefined
  token: Token | null
  highlight: boolean
  status: SlotStatus
  onDropToken: (tokenId: string, slotId: SlotId) => void
  onClearSlot: (slotId: SlotId) => void
  canAccept: (tokenId: string) => boolean
  selectedTokenId: string | null
  announce: (message: string) => void
}) => {
  const groupRef = useRef<SVGGElement>(null)
  const [focused, setFocused] = useState(false)
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'diagram-token',
    canDrop: (item: DragItem) => canAccept(item.tokenId),
    drop: (item: DragItem) => {
      onDropToken(item.tokenId, node.slotId)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  useEffect(() => {
    if (groupRef.current) {
      drop(groupRef.current)
    }
  }, [drop])

  const showHighlight = highlight || (isOver && canDrop)
  const blocked = isOver && !canDrop

  let fill = slotFill
  if (status === 'correct') fill = correctFill
  if (status === 'incorrect') fill = incorrectFill
  if (showHighlight) fill = highlightFill
  if (blocked) fill = '#fee2e2'

  const stroke = blocked ? '#ef4444' : highlight ? '#f59e0b' : focused ? '#2563eb' : strokeBase

  return (
    <g
      ref={groupRef}
      tabIndex={0}
      focusable="true"
      role="button"
      aria-label={buildSlotLabel(node.slotId, accepts)}
      aria-description={getSlotDescription(accepts)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (!selectedTokenId) {
            announce('Select a token first, then press Enter on a slot to place it.')
            return
          }
          if (!canAccept(selectedTokenId)) {
            announce('That word does not match this slot.')
            return
          }
          onDropToken(selectedTokenId, node.slotId)
        }
        if (event.key === 'Backspace' || event.key === 'Delete') {
          event.preventDefault()
          if (placement) {
            onClearSlot(node.slotId)
            announce(`Removed ${token?.text ?? placement.tokenId} from the ${buildSlotLabel(node.slotId, accepts)}`)
          }
        }
      }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={6}
        ry={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      {token && (
        <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 6} textAnchor="middle" style={textStyle}>
          {token.text}
        </text>
      )}
    </g>
  )
}

const DiagramCanvas = ({
  spec,
  placements,
  tokens,
  roles,
  highlightedSlots,
  statusBySlot,
  onDropToken,
  onClearSlot,
  selectedTokenId,
  announce,
}: DiagramCanvasProps) => {
  const constraintMap = useConstraintMap(spec)
  const placementMap = useMemo(() => buildPlacementMap(placements), [placements])
  const tokenMap = useMemo(() => new Map(tokens.map((token) => [token.id, token])), [tokens])

  const canAcceptToken = (slotPath: string, tokenId: string) => {
    const accepts = constraintMap.get(slotPath)
    if (!accepts) return false
    const tokenRoles = roles[tokenId]
    if (!tokenRoles) return false
    return tokenRoles.some((role) => accepts.includes(role))
  }

  const renderNode = (node: DiagramSpec['nodes'][number]) => {
    switch (node.type) {
      case 'spine':
        return <line key={node.id} x1={node.x} y1={node.y} x2={node.x + node.w} y2={node.y} stroke={strokeBase} strokeWidth={3} />
      case 'bar':
        return <line key={node.id} x1={node.x} y1={node.y} x2={node.x} y2={node.y + node.h} stroke={strokeBase} strokeWidth={3} />
      case 'line':
        return <line key={node.id} x1={node.x} y1={node.y} x2={node.w} y2={node.h} stroke={strokeBase} strokeWidth={3} />
      case 'slot': {
        const accepts = constraintMap.get(node.slotId.path) ?? []
        const placement = placementMap.get(node.slotId.path)
        const highlight = highlightedSlots.has(node.slotId.path)
        const status = statusBySlot.get(node.slotId.path) ?? 'default'
        const token = placement ? tokenMap.get(placement.tokenId) ?? null : null

        return (
          <SlotGroup
            key={node.id}
            node={node}
            accepts={accepts}
            placement={placement}
            token={token}
            highlight={highlight}
            status={status}
            canAccept={(tokenId) => canAcceptToken(node.slotId.path, tokenId)}
            onDropToken={onDropToken}
            onClearSlot={onClearSlot}
            selectedTokenId={selectedTokenId}
            announce={announce}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <div style={containerStyle}>
      <svg width="100%" height="100%" viewBox="0 0 480 260" role="img" aria-label="Sentence diagram canvas">
        {spec.nodes.map((node) => renderNode(node))}
      </svg>
    </div>
  )
}

export default DiagramCanvas
