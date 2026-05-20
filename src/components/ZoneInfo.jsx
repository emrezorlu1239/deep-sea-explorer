import './ZoneInfo.css'

const ZONES = [
  { min: 0,    max: 200,   name: 'Epipelagic Zone',    sub: 'Sunlight Zone',             fact: '90% of ocean life thrives here.',                  creature: 'Sardines'        },
  { min: 200,  max: 1000,  name: 'Mesopelagic Zone',   sub: 'Twilight Zone',             fact: 'Only 1% of sunlight reaches this depth.',          creature: 'Jellyfish'       },
  { min: 1000, max: 4000,  name: 'Bathypelagic Zone',  sub: 'Midnight Zone',             fact: 'Pitch black. Bioluminescence is the only light.',  creature: 'Anglerfish'      },
  { min: 4000, max: 6000,  name: 'Abyssopelagic Zone', sub: 'Abyssal Zone',              fact: 'Pressure 400 atm. Temperature below 2°C.',         creature: 'Giant Squid'     },
  { min: 6000, max: 11001, name: 'Hadal Zone',         sub: 'Mariana Trench · 11,034 m', fact: "Earth's deepest point. Still largely unexplored.", creature: 'Hadal Snailfish' },
]

function getZone(depth) {
  return ZONES.find(z => depth >= z.min && depth < z.max) || ZONES[ZONES.length - 1]
}

export default function ZoneInfo({ depth }) {
  const zone = getZone(depth)

  return (
    <div className="zone-info">
      <p className="zone-name">{zone.name}</p>
      <p className="zone-sub">{zone.sub}</p>
      <p className="zone-creature">▶ {zone.creature}</p>
      <p className="zone-fact">{zone.fact}</p>
    </div>
  )
}