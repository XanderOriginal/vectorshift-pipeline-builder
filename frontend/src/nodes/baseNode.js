import { Handle, Position } from 'reactflow';

const NODE_COLORS = {
  customInput:  { border: '#00ff88', glow: 'rgba(0,255,136,0.25)',  title: '#00ff88' },
  customOutput: { border: '#00e5ff', glow: 'rgba(0,229,255,0.25)',  title: '#00e5ff' },
  llm:          { border: '#a855f7', glow: 'rgba(168,85,247,0.25)', title: '#a855f7' },
  text:         { border: '#f59e0b', glow: 'rgba(245,158,11,0.25)', title: '#f59e0b' },
  api:          { border: '#ef4444', glow: 'rgba(239,68,68,0.25)',  title: '#ef4444' },
  filter:       { border: '#f97316', glow: 'rgba(249,115,22,0.25)', title: '#f97316' },
  merge:        { border: '#06b6d4', glow: 'rgba(6,182,212,0.25)',  title: '#06b6d4' },
  transform:    { border: '#8b5cf6', glow: 'rgba(139,92,246,0.25)', title: '#8b5cf6' },
  note:         { border: '#f5c518', glow: 'rgba(245,197,24,0.2)',  title: '#f5c518' },
};

const DEFAULT_COLOR = { border: '#00ff88', glow: 'rgba(0,255,136,0.25)', title: '#00ff88' };

export const BaseNode = ({ id, title, nodeType, inputs = [], outputs = [], children, style = {} }) => {
  const totalInputs = inputs.length;
  const totalOutputs = outputs.length;
  const colors = NODE_COLORS[nodeType] || DEFAULT_COLOR;

  return (
    <div style={{
      minWidth: 220,
      minHeight: 90,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      boxShadow: `0 0 12px ${colors.glow}`,
      fontFamily: "'Segoe UI', sans-serif",
      color: '#e0e0e0',
      position: 'relative',
      padding: '10px 14px 12px',
      ...style,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: colors.title,
        borderBottom: `1px solid ${colors.border}33`,
        paddingBottom: 6,
        marginBottom: 10,
      }}>
        {title}
      </div>

      <div style={{ paddingLeft: 8, paddingRight: 8 }}>{children}</div>

      {inputs.map((input, i) => (
        <div key={`in-${input.id}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{
              top: totalInputs === 1 ? '50%' : `${((i + 1) / (totalInputs + 1)) * 100}%`,
              background: '#00e5ff',
              border: '2px solid #1a1a2e',
              width: 10,
              height: 10,
            }}
          />
          {input.label && (
            <span style={{
              position: 'absolute',
              left: -42,
              top: totalInputs === 1
                ? 'calc(50% + 4px)'
                : `calc(${((i + 1) / (totalInputs + 1)) * 100}% + 4px)`,
              fontSize: 9,
              color: '#00e5ff',
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              background: '#0d1117',
              padding: '1px 4px',
              borderRadius: 3,
              border: '1px solid #00e5ff44',
            }}>
              {input.label}
            </span>
          )}
        </div>
      ))}

      {outputs.map((output, i) => (
        <div key={`out-${output.id}`}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{
              top: totalOutputs === 1 ? '50%' : `${((i + 1) / (totalOutputs + 1)) * 100}%`,
              background: colors.border,
              border: '2px solid #1a1a2e',
              width: 10,
              height: 10,
            }}
          />
          {output.label && (
            <span style={{
              position: 'absolute',
              right: -42,
              top: totalOutputs === 1
                ? 'calc(50% + 4px)'
                : `calc(${((i + 1) / (totalOutputs + 1)) * 100}% + 4px)`,
              fontSize: 9,
              color: colors.border,
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              background: '#0d1117',
              padding: '1px 4px',
              borderRadius: 3,
              border: `1px solid ${colors.border}44`,
            }}>
              {output.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};