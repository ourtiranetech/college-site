import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/parents-eleves/emploi-du-temps')({
  component: EmploiPage,
})

type Subject = { name: string; color: string }
type Cell = Subject | null
type DayKey = 'dimanche' | 'lundi' | 'mardi' | 'mercredi' | 'jeudi'

const SUBJECTS: Record<string, Subject> = {
  math:   { name: 'Mathématiques', color: 'bg-blue-50 text-blue-800 border-blue-300' },
  france: { name: 'Français', color: 'bg-green-50 text-green-800 border-green-300' },
  arab:   { name: 'Arabe', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  sci:    { name: 'Sciences', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  hist:   { name: 'Histoire', color: 'bg-rose-50 text-rose-800 border-rose-300' },
  geo:    { name: 'Géographie', color: 'bg-teal-50 text-teal-800 border-teal-300' },
  eng:    { name: 'Anglais', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
  phys:   { name: 'Physique', color: 'bg-orange-50 text-orange-800 border-orange-300' },
  svt:    { name: 'SVT', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  eps:    { name: 'EPS', color: 'bg-pink-50 text-pink-800 border-pink-300' },
  tech:   { name: 'Technologie', color: 'bg-cyan-50 text-cyan-800 border-cyan-300' },
}

type HourEntry = { label: string; lunch?: boolean; pm?: boolean }
const HOURS: HourEntry[] = [
  { label: '8h00 – 9h00' },
  { label: '9h00 – 10h00' },
  { label: '10h00 – 11h00' },
  { label: '11h00 – 12h00' },
  { label: '12h00 – 13h30', lunch: true },
  { label: '13h30 – 14h30', pm: true },
  { label: '14h30 – 15h30', pm: true },
  { label: '15h30 – 16h30', pm: true },
  { label: '16h30 – 17h30', pm: true },
]

const DAYS = [
  { key: 'dimanche' as DayKey, label: 'Dimanche' },
  { key: 'lundi' as DayKey,    label: 'Lundi' },
  { key: 'mardi' as DayKey,    label: 'Mardi' },
  { key: 'mercredi' as DayKey, label: 'Mercredi' },
  { key: 'jeudi' as DayKey,    label: 'Jeudi' },
]

// 20 individual timetables: 1M1 → 4M5
// 9 cells: 4 morning + 1 lunch + 4 afternoon
const TIMETABLES: { label: string; days: Record<DayKey, (string | null)[]> }[] = [
  // === 1M1 ===
  { label: '1M1', days: {
    dimanche: ['math','france','sci','hist',null,'arab','geo','eps','eng'],
    lundi:    ['arab','math','france','hist',null,'eng','phys','svt','eps'],
    mardi:    ['france','arab','math','hist',null,null,null,null,null],
    mercredi: ['sci','math','france','eng',null,'hist','geo','arab','eps'],
    jeudi:    ['arab','math','sci','geo',null,'france','eps','hist','eng'],
  }},
  // === 1M2 ===
  { label: '1M2', days: {
    dimanche: ['france','math','sci','hist',null,'arab','geo','eng','eps'],
    lundi:    ['math','arab','france','hist',null,'phys','eng','svt','eps'],
    mardi:    ['arab','france','math','hist',null,null,null,null,null],
    mercredi: ['math','sci','france','eng',null,'geo','hist','arab','eps'],
    jeudi:    ['math','arab','sci','geo',null,'eps','france','hist','eng'],
  }},
  // === 1M3 ===
  { label: '1M3', days: {
    dimanche: ['sci','france','math','hist',null,'arab','geo','eps','eng'],
    lundi:    ['france','math','arab','hist',null,'eng','phys','svt','eps'],
    mardi:    ['math','arab','france','hist',null,null,null,null,null],
    mercredi: ['france','sci','math','eng',null,'hist','arab','geo','eps'],
    jeudi:    ['sci','math','arab','geo',null,'france','eps','hist','eng'],
  }},
  // === 1M4 ===
  { label: '1M4', days: {
    dimanche: ['hist','math','sci','france',null,'arab','geo','eps','eng'],
    lundi:    ['arab','hist','math','france',null,'eng','phys','svt','eps'],
    mardi:    ['math','arab','hist','france',null,null,null,null,null],
    mercredi: ['math','hist','sci','eng',null,'france','geo','arab','eps'],
    jeudi:    ['arab','hist','sci','geo',null,'math','eps','france','eng'],
  }},
  // === 1M5 ===
  { label: '1M5', days: {
    dimanche: ['math','hist','sci','france',null,'arab','geo','eng','eps'],
    lundi:    ['arab','math','hist','france',null,'eng','phys','eps','svt'],
    mardi:    ['hist','arab','math','france',null,null,null,null,null],
    mercredi: ['sci','math','hist','eng',null,'france','geo','arab','eps'],
    jeudi:    ['arab','math','sci','geo',null,'hist','eps','france','eng'],
  }},
  // === 2M1 ===
  { label: '2M1', days: {
    dimanche: ['math','arab','sci','hist',null,'france','geo','hist','eng'],
    lundi:    ['france','math','arab','hist',null,'arab','tech','svt','geo'],
    mardi:    ['arab','math','france','hist',null,null,null,null,null],
    mercredi: ['sci','hist','geo','math',null,'eng','phys','arab','eng'],
    jeudi:    ['france','sci','math','geo',null,'arab','eps','tech','geo'],
  }},
  // === 2M2 ===
  { label: '2M2', days: {
    dimanche: ['arab','math','sci','hist',null,'france','geo','eng','hist'],
    lundi:    ['math','france','arab','hist',null,'tech','arab','svt','geo'],
    mardi:    ['math','arab','france','hist',null,null,null,null,null],
    mercredi: ['hist','sci','math','geo',null,'phys','eng','arab','eng'],
    jeudi:    ['sci','france','math','geo',null,'tech','arab','eps','geo'],
  }},
  // === 2M3 ===
  { label: '2M3', days: {
    dimanche: ['sci','arab','math','hist',null,'france','geo','hist','eng'],
    lundi:    ['arab','math','france','hist',null,'arab','svt','tech','geo'],
    mardi:    ['arab','math','hist','france',null,null,null,null,null],
    mercredi: ['geo','sci','hist','math',null,'arab','phys','eng','eng'],
    jeudi:    ['math','sci','france','geo',null,'arab','eps','tech','geo'],
  }},
  // === 2M4 ===
  { label: '2M4', days: {
    dimanche: ['hist','arab','sci','math',null,'france','geo','eng','hist'],
    lundi:    ['france','arab','math','hist',null,'tech','arab','geo','svt'],
    mardi:    ['arab','hist','math','france',null,null,null,null,null],
    mercredi: ['hist','geo','sci','math',null,'eng','arab','phys','eng'],
    jeudi:    ['arab','france','sci','geo',null,'tech','math','eps','geo'],
  }},
  // === 2M5 ===
  { label: '2M5', days: {
    dimanche: ['math','hist','arab','sci',null,'france','geo','eng','hist'],
    lundi:    ['arab','france','math','hist',null,'arab','tech','geo','svt'],
    mardi:    ['hist','arab','arab','france',null,null,null,null,null],
    mercredi: ['sci','hist','geo','math',null,'phys','arab','eng','eng'],
    jeudi:    ['france','arab','sci','geo',null,'tech','eps','math','geo'],
  }},
  // === 3M1 ===
  { label: '3M1', days: {
    dimanche: ['math','sci','france','hist',null,'arab','eng','hist','phys'],
    lundi:    ['arab','math','sci','geo',null,'france','sci','tech','phys'],
    mardi:    ['france','arab','math','hist',null,null,null,null,null],
    mercredi: ['sci','hist','math','eng',null,'arab','geo','arab','phys'],
    jeudi:    ['arab','sci','france','math',null,'france','eps','tech','geo'],
  }},
  // === 3M2 ===
  { label: '3M2', days: {
    dimanche: ['sci','math','france','hist',null,'arab','eng','phys','hist'],
    lundi:    ['math','arab','sci','geo',null,'france','tech','sci','phys'],
    mardi:    ['arab','france','math','hist',null,null,null,null,null],
    mercredi: ['hist','sci','math','eng',null,'geo','arab','arab','phys'],
    jeudi:    ['sci','arab','france','math',null,'france','tech','eps','geo'],
  }},
  // === 3M3 ===
  { label: '3M3', days: {
    dimanche: ['france','sci','math','hist',null,'arab','eng','hist','phys'],
    lundi:    ['arab','math','sci','geo',null,'france','sci','phys','tech'],
    mardi:    ['sci','arab','math','hist',null,null,null,null,null],
    mercredi: ['math','hist','sci','eng',null,'arab','geo','arab','phys'],
    jeudi:    ['france','sci','arab','math',null,'france','eps','tech','geo'],
  }},
  // === 3M4 ===
  { label: '3M4', days: {
    dimanche: ['hist','sci','france','math',null,'arab','eng','phys','hist'],
    lundi:    ['math','arab','sci','geo',null,'france','tech','phys','sci'],
    mardi:    ['sci','arab','hist','math',null,null,null,null,null],
    mercredi: ['hist','math','sci','eng',null,'arab','arab','geo','phys'],
    jeudi:    ['arab','france','sci','math',null,'france','tech','eps','geo'],
  }},
  // === 3M5 ===
  { label: '3M5', days: {
    dimanche: ['math','hist','sci','france',null,'arab','eng','phys','hist'],
    lundi:    ['arab','math','sci','geo',null,'france','sci','tech','phys'],
    mardi:    ['hist','arab','sci','math',null,null,null,null,null],
    mercredi: ['sci','hist','math','eng',null,'arab','geo','arab','phys'],
    jeudi:    ['sci','arab','france','math',null,'france','eps','tech','geo'],
  }},
  // === 4M1 ===
  { label: '4M1', days: {
    dimanche: ['math','france','sci','hist',null,'arab','eng','phys','eps'],
    lundi:    ['arab','math','france','eng',null,'france','sci','tech','phys'],
    mardi:    ['france','arab','math','hist',null,null,null,null,null],
    mercredi: ['sci','hist','geo','math',null,'arab','geo','arab','phys'],
    jeudi:    ['arab','sci','france','math',null,'france','eps','tech','geo'],
  }},
  // === 4M2 ===
  { label: '4M2', days: {
    dimanche: ['france','math','sci','hist',null,'arab','eng','eps','phys'],
    lundi:    ['math','arab','france','eng',null,'france','tech','phys','sci'],
    mardi:    ['arab','france','math','hist',null,null,null,null,null],
    mercredi: ['hist','sci','math','geo',null,'geo','arab','arab','phys'],
    jeudi:    ['sci','arab','france','math',null,'france','tech','eps','geo'],
  }},
  // === 4M3 ===
  { label: '4M3', days: {
    dimanche: ['sci','france','math','hist',null,'arab','eng','phys','eps'],
    lundi:    ['arab','math','france','eng',null,'france','sci','phys','tech'],
    mardi:    ['france','arab','hist','math',null,null,null,null,null],
    mercredi: ['geo','hist','sci','math',null,'arab','geo','arab','phys'],
    jeudi:    ['france','sci','arab','math',null,'france','tech','eps','geo'],
  }},
  // === 4M4 ===
  { label: '4M4', days: {
    dimanche: ['hist','france','sci','math',null,'arab','eng','phys','eps'],
    lundi:    ['math','arab','france','eng',null,'france','tech','sci','phys'],
    mardi:    ['arab','france','hist','math',null,null,null,null,null],
    mercredi: ['hist','geo','math','sci',null,'arab','arab','geo','phys'],
    jeudi:    ['sci','arab','france','math',null,'france','eps','tech','geo'],
  }},
  // === 4M5 ===
  { label: '4M5', days: {
    dimanche: ['math','hist','sci','france',null,'arab','eng','eps','phys'],
    lundi:    ['arab','math','france','eng',null,'france','sci','phys','tech'],
    mardi:    ['hist','arab','france','math',null,null,null,null,null],
    mercredi: ['sci','hist','geo','math',null,'geo','arab','arab','phys'],
    jeudi:    ['france','sci','arab','math',null,'france','tech','eps','geo'],
  }},
]

function Cell({ cell }: { cell: string | null }) {
  if (!cell) return <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-1.5" />
  const sub = SUBJECTS[cell]
  if (!sub) return <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-1.5" />
  return <div className={`rounded-lg border p-1.5 text-center text-[10px] font-semibold leading-tight shadow-sm ${sub.color}`}>{sub.name}</div>
}

function EmploiPage() {
  const [tableIdx, setTableIdx] = useState(0)
  const tab = TIMETABLES[tableIdx]

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        {/* <p className="island-kicker mb-2">Emploi du temps</p> */}
        <h1 className="display-title mb-1 text-4xl text-center font-bold text-(--sea-ink) sm:text-5xl">Emploi du temps:{tab.label} </h1>
        {/* <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)"></p> */}
      </section>

      {/* Single dropdown: 20 classes */}
      <section className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="class-select" className="text-sm font-medium text-slate-700">Classe :</label>
        <select
          id="class-select"
          value={tableIdx}
          onChange={e => setTableIdx(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147]"
        >
          {TIMETABLES.map((t, i) => (
            <option key={t.label} value={i}>{t.label}</option>
          ))}
        </select>
      </section>

      {/* Timetable */}
      <section className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left min-w-180">
          <thead>
            <tr className="bg-slate-50">
              <th className="w-32 px-3 py-3 text-xs font-semibold text-slate-400">Horaire</th>
              {DAYS.map(d => (
                <th key={d.key} className="px-3 py-3 text-xs font-semibold text-slate-700">{d.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h, hi) => (
              <tr key={hi} className={h.lunch ? 'bg-amber-50/50' : 'bg-white'}>
                <td className={`px-3 py-2 text-[10px] font-medium ${h.lunch ? 'text-amber-600' : h.pm ? 'text-slate-500' : 'text-slate-700'}`}>
                  {h.lunch ? 'Déjeuner' : h.pm ? 'Après-midi' : h.label}
                </td>
                {DAYS.map(d => {
                  const cell = tab.days[d.key][hi]
                  const isTuePm = d.key === 'mardi' && !!h.pm
                  return (
                    <td key={d.key} className="px-2 py-1 align-top">
                      {isTuePm ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2 text-center text-[10px] font-medium text-slate-400">Libre</div>
                      ) : h.lunch ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-amber-50/30 p-2 text-center text-[10px] font-medium text-amber-700">Pause</div>
                      ) : (
                        <Cell cell={cell} />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Legend */}
      <section className="mt-6 flex flex-wrap gap-3">
        {Object.values(SUBJECTS).map(s => (
          <div key={s.name} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
            <span className={`rounded-md border px-2 py-0.5 ${s.color}`}>{s.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
          <span className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-2 py-0.5">Libre</span>
        </div>
      </section>
    </main>
  )
}
