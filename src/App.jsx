import { useScroll } from './hooks/useScroll'
import Ocean from './components/Ocean'
import Creatures from './components/Creatures'
import DepthMeter from './components/DepthMeter'
import ZoneInfo from './components/ZoneInfo'
import './App.css'

function App() {
  const { depth } = useScroll()

  return (
    <div className="app">
      <div className="scroll-container" />
      <div className="viewport">
        <Ocean depth={depth} />
        <Creatures depth={depth} />
        <ZoneInfo depth={depth} />
        <DepthMeter depth={depth} />
      </div>
    </div>
  )
}

export default App