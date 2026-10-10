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
  arab:   { name: 'Arabique', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  sci:    { name: 'Sciences', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  hist:   { name: 'Histoire', color: 'bg-rose-50 text-rose-800 border-rose-300' },
  geo:    { name: 'Géographie', color: 'bg-teal-50 text-teal-800 border-teal-300' },
  eng:    { name: 'Anglais', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
  phys:   { name: 'Physique', color: 'bg-orange-50 text-orange-800 border-orange-300' },
  svt:    { name: 'SVT', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  eps:    { name: 'EPS', color: 'bg-pink-50 text-pink-800 border-pink-300' },
  tech:   { name: 'Technologie', color: 'bg-cyan-50 text-cyan-800 border-cyan-300' },
}

const HOURS = [
  { label: '8h00 – 9h00' },
  { label: '9h00 – 10h00', pause: true },
  { label: '10h00 – 11h00' },
  { label: '11h00 – 12h00', lunch: true },
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

// Base schedule per year (array of 11 cells per day: 3 morning, pause, 3 morning, lunch, 3 afternoon)
const BASE_SCHEDULES: Record<string, Record<DayKey, (string | null)[]>> = {
  '1ère': {
    dimanche: ['math','france','sci',null,'arab','hist','geo',null,'eps','eng','tech'],
    lundi:    ['arab','math','hist',null,'france','sci','geo',null,'phys','svt','eps'],
    mardi:    ['france','arab','math',null,null,null,null,null,null,null,null],
    mercredi: ['sci','math','eng',null,'hist','geo','eps',null,'arab','svt','phys'],
    jeudi:    ['arab','math','sci',null,'france','eps','tech',null,'hist','geo','eng'],
  },
  '2ème': {
    dimanche: ['math','arab','sci',null,'france','geo','hist',null,'eng','phys','eps'],
    lundi:    ['france','math','hist',null,'arab','sci','eng',null,'tech','svt','geo'],
    mardi:    ['arab','math','france',null,null,null,null,null,null,null,null],
    mercredi: ['sci','hist','geo',null,'math','arab','eps',null,'eng','phys','svt'],
    jeudi:    ['france','sci','math',null,'arab','eps','tech',null,'hist','eng','geo'],
  },
  '3ème': {
    dimanche: ['math','sci','france',null,'arab','eng','hist',null,'phys','svt','eps'],
    lundi:    ['arab','math','geo',null,'france','sci','hist',null,'tech','eng','phys'],
    mardi:    ['france','arab','math',null,null,null,null,null,null,null,null],
    mercredi: ['sci','hist','eng',null,'math','arab','eps',null,'geo','svt','phys'],
    jeudi:    ['arab','sci','math',null,'france','eps','tech',null,'hist','eng','geo'],
  },
  '4ème': {
    dimanche: ['math','france','sci',null,'arab','hist','eng',null,'phys','geo','eps'],
    lundi:    ['arab','math','eng',null,'france','sci','hist',null,'svt','tech','phys'],
    mardi:    ['france','arab','math',null,null,null,null,null,null,null,null],
    mercredi: ['sci','hist','geo',null,'math','arab','eps',null,'eng','phys','svt'],
    jeudi:    ['arab','sci','math',null,'france','eps','tech',null,'hist','eng','geo'],
  },
}

const YEAR_LABELS: Record<string, { label: string; subtitle: string }> = {
  '1ère': { label: '1ère Année', subtitle: 'Cycle Moyen' },
  '2ème': { label: '2ème Année', subtitle: 'Cycle Moyen' },
  '3ème': { label: '3ème Année', subtitle: 'Cycle Moyen' },
  '4ème': { label: '4ème Année', subtitle: 'Cycle Moyen' },
}

// Rotate an array by n positions (skip nulls, rotate only subjects)
function rotateSchedule(schedule: Record<DayKey, (string | null)[]>, shift: number): Record<DayKey, Cell[]> {
  const result: Record<DayKey, Cell[]> = {} as any
  for (const day of Object.keys(schedule) as DayKey[]) {
    result[day] = schedule[day].map(cell => {
      if (!cell) return null
      // Find index of this subject in the day's subject list
      const subjects = schedule[day].filter((c): c is string => c !== null)
      const idx = subjects.indexOf(cell)
      const rotated = subjects[(idx + shift) % subjects.length]
      return SUBJECTS[rotated as keyof typeof SUBJECTS] ?? null
    })
  }
  return result
}

// Build 4 years × 5 classes = 20 timetables
const ALL_TIMETABLES: { yearKey: string; yearLabel: string; classLabel: string; days: Record<DayKey, Cell[]> }[] = []

for (const [yearKey, baseSchedule] of Object.entries(BASE_SCHEDULES)) {
  const { label } = YEAR_LABELS[yearKey] ?? { label: yearKey, subtitle: '' }
  for (let c = 0; c < 5; c++) {
    const classLetter = String.fromCharCode(65 + c) // A, B, C, D, E
    ALL_TIMETABLES.push({
      yearKey,
      yearLabel: label,
      classLabel: `${label} — Classe ${classLetter}`,
      days: rotateSchedule(baseSchedule, c * 2),
    })
  }
}

function Cell({ cell }: { cell: Cell }) {
  if (!cell) return <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-1.5" />
  return <div className={`rounded-lg border p-1.5 text-center text-[10px] font-semibold leading-tight shadow-sm ${cell.color}`}>{cell.name}</div>
}

function EmploiPage() {
  const [yearIdx, setYearIdx] = useState(0)
  const [classIdx, setClassIdx] = useState(0)

  // Determine which timetables belong to the selected year
  const yearKey = ALL_TIMETABLES[yearIdx * 5 + 0]?.yearKey ?? '4ème'
  const yearSubtitle = YEAR_LABELS[yearKey]?.subtitle ?? ''
  const classOffset = yearIdx * 5
  const classTimetables = ALL_TIMETABLES.slice(classOffset, classOffset + 5)
  const tab = classTimetables[classIdx]

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Emploi du temps</p>
        <h1 className="display-title mb-1 text-4xl font-bold text-(--sea-ink) sm:text-5xl">Emploi du temps</h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--sea-ink-soft)">{tab?.yearLabel} — {yearSubtitle}</p>
      </section>

      {/* Year selector */}
      <section className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="year-select" className="text-sm font-medium text-slate-700">Année :</label>
        <select
          id="year-select"
          value={yearIdx}
          onChange={e => { setYearIdx(Number(e.target.value)); setClassIdx(0) }}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147]"
        >
          {Object.entries(YEAR_LABELS).map(([key, y]) => (
            <option key={key} value={Object.keys(YEAR_LABELS).indexOf(key)}>{y.label}</option>
          ))}
        </select>

        {/* Class selector */}
        <label htmlFor="class-select" className="text-sm font-medium text-slate-700">Classe :</label>
        <select
          id="class-select"
          value={classIdx}
          onChange={e => setClassIdx(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F2147]/20 focus:border-[#0F2147]"
        >
          {classTimetables.map((ct, i) => (
            <option key={ct.classLabel} value={i}>{ct.classLabel.replace(/^.*—\s*/, '')}</option>
          ))}
        </select>
      </section>

      {/* Timetable */}
      <section className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left min-w-180">
          <thead>
            <tr className="bg-slate-50">
              <th className="w-28 px-3 py-3 text-xs font-semibold text-slate-400">Horaire</th>
              {DAYS.map(d => (
                <th key={d.key} className="px-3 py-3 text-xs font-semibold text-slate-700">{d.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h, hi) => (
              <tr key={hi} className={h.pause ? 'bg-slate-100/60' : h.lunch ? 'bg-amber-50/50' : 'bg-white'}>
                <td className={`px-3 py-2 text-[10px] font-medium ${h.pause ? 'text-slate-400' : h.lunch ? 'text-amber-600' : h.pm ? 'text-slate-500' : 'text-slate-700'}`}>
                  {h.pause ? 'Pause' : h.lunch ? 'Déjeuner' : h.pm ? 'Après-midi' : h.label}
                </td>
                {DAYS.map(d => {
                  const cell = tab?.days[d.key][hi]
                  const isTuePm = d.key === 'mardi' && h.pm
                  return (
                    <td key={d.key} className="px-2 py-1 align-top">
                      {isTuePm ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-2 text-center text-[10px] font-medium text-slate-400">Libre</div>
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