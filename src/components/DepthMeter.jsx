import './DepthMeter.css'

const MAX = 11000
const TICKS = [0, 200, 1000, 4000, 6000, 11000]

export default function DepthMeter({ depth }) {
  const pct = (depth / MAX) * 100

  return (
    <div className="depth-meter">
      <div className="meter-track">
        <div className="meter-fill" style={{ height: `${pct}%` }} />
        <div className="meter-dot" style={{ top: `${pct}%` }} />
        {TICKS.map(tick => (
          <div
            key={tick}
            className="meter-tick"
            style={{ top: `${(tick / MAX) * 100}%` }}
          />
        ))}
      </div>
      <div className="depth-label" style={{ top: `${pct}%` }}>
        {Math.round(depth)} m
      </div>
    </div>
  )
}