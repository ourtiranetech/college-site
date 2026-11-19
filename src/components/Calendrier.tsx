import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'

// ── Calendrier scolaire algérien 2026-2027 (d'après le ministère de l'Éducation) ──

interface CalendarDay {
  date: Date
  day: number
  isHoliday: boolean
  isVacation: boolean
  isWeekend: boolean
  label: string
}

const FRENCH_WEEKEND = [6, 0] // Samedi, Dimanche

// Jours fériés nationaux et civils officiels
const NATIONAL_HOLIDAYS: Date[] = [
  new Date(2026, 10, 1),  // 1er novembre 2026 - Anniversaire du déclenchement de la Révolution
  new Date(2027, 0, 1),   // 1er janvier 2027 - Jour de l'an grégorien
  new Date(2027, 0, 12),  // 12 janvier 2027 - Yennayer
  new Date(2027, 4, 1),   // 1er mai 2027 - Fête du Travail
  new Date(2027, 6, 5),   // 5 juillet 2027 - Fête de l'Indépendance et de la Jeunesse
]

// Vacances d'automne : 27 oct 2026 (soir) - 2 nov 2026 (matin)
const AUTUMN_VACATION = {
  start: new Date(2026, 9, 27),
  end: new Date(2026, 10, 2),
}

// Vacances d'hiver : 17 déc 2026 (soir) - 3 jan 2027 (matin)
const WINTER_VACATION = {
  start: new Date(2026, 11, 17),
  end: new Date(2027, 0, 3),
}

// Vacances de printemps : 18 mars 2027 (soir) - 4 avr 2027 (matin)
const SPRING_VACATION = {
  start: new Date(2027, 2, 18),
  end: new Date(2027, 3, 4),
}

// Vacances d'été : après les examens du 3e trimestre
// Forfait : 28 mai 2027 - 15 septembre 2027
const SUMMER_VACATION = {
  start: new Date(2027, 4, 28),
  end: new Date(2027, 8, 15),
}

// Fêtes religieuses (dates prévisionnelles)
const RELIGIOUS_HOLIDAYS: Date[] = [
  new Date(2027, 2, 10),  // Aïd El-Fitr (10 mars 2027)
  new Date(2027, 2, 11),  // Aïd El-Fitr (11 mars 2027)
  new Date(2027, 2, 12),  // Aïd El-Fitr (12 mars 2027)
  new Date(2027, 4, 17),  // Aïd El-Adha (17 mai 2027)
  new Date(2027, 4, 18),  // Aïd El-Adha (18 mai 2027)
  new Date(2027, 4, 19),  // Aïd El-Adha (19 mai 2027)
  new Date(2027, 5, 6),   // Awal Moharram (6 juin 2027)
  new Date(2027, 5, 15),  // Achoura (15 juin 2027)
]

// Fonctions utilitaires

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}

function isNationalHoliday(date: Date): boolean {
  return NATIONAL_HOLIDAYS.some(
    (h) => h.getDate() === date.getDate() && h.getMonth() === date.getMonth() && h.getFullYear() === date.getFullYear()
  )
}

function isReligiousHoliday(date: Date): boolean {
  return RELIGIOUS_HOLIDAYS.some(
    (h) => h.getDate() === date.getDate() && h.getMonth() === date.getMonth() && h.getFullYear() === date.getFullYear()
  )
}

function isDateInVacationRanges(date: Date): boolean {
  return (
    isDateInRange(date, AUTUMN_VACATION.start, AUTUMN_VACATION.end) ||
    isDateInRange(date, WINTER_VACATION.start, WINTER_VACATION.end) ||
    isDateInRange(date, SPRING_VACATION.start, SPRING_VACATION.end) ||
    isDateInRange(date, SUMMER_VACATION.start, SUMMER_VACATION.end)
  )
}

function formatDate(date: Date): string {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// ── Composant Calendrier ──

export function Calendrier() {
  const { t } = useLanguage()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const monthNames = [
    t('parents.calendrier.janvier') || 'Janvier',
    t('parents.calendrier.février') || 'Février',
    t('parents.calendrier.mars') || 'Mars',
    t('parents.calendrier.avril') || 'Avril',
    t('parents.calendrier.may') || 'Mai',
    t('parents.calendrier.juin') || 'Juin',
    t('parents.calendrier.juillet') || 'Juillet',
    t('parents.calendrier.aout') || 'Août',
    t('parents.calendrier.septembre') || 'Septembre',
    t('parents.calendrier.octobre') || 'Octobre',
    t('parents.calendrier.novembre') || 'Novembre',
    t('parents.calendrier.decembre') || 'Décembre',
  ]

  const dayNames = [
    t('parents.calendrier.lundi') || 'L',
    t('parents.calendrier.mardi') || 'M',
    t('parents.calendrier.mercredi') || 'M',
    t('parents.calendrier.jeudi') || 'J',
    t('parents.calendrier.vendredi') || 'V',
    t('parents.calendrier.samedi') || 'S',
    t('parents.calendrier.dimanche') || 'D',
  ]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const days: CalendarDay[][] = []
  let dayCounter = 1

  for (let i = 0; i < 6; i++) {
    const row: CalendarDay[] = []
    for (let j = 0; j < 7; j++) {
      let date: Date
      let isHoliday: boolean
      let isVacation: boolean
      let isWeekend: boolean

      if (i === 0 && j < startPadding) {
        // Jours du mois précédent
        date = new Date(currentYear, currentMonth, -startPadding + j + 1)
        const isHolidayDay = isNationalHoliday(date) || isReligiousHoliday(date)
        isHoliday = isHolidayDay
        isVacation = isDateInVacationRanges(date)
        isWeekend = FRENCH_WEEKEND.includes(date.getDay())
      } else if (dayCounter > daysInMonth) {
        // Jours du mois suivant
        date = new Date(currentYear, currentMonth + 1, dayCounter - daysInMonth)
        const isHolidayDay = isNationalHoliday(date) || isReligiousHoliday(date)
        isHoliday = isHolidayDay
        isVacation = isDateInVacationRanges(date)
        isWeekend = FRENCH_WEEKEND.includes(date.getDay())
        dayCounter++
      } else {
        // Jours du mois courant
        date = new Date(currentYear, currentMonth, dayCounter)
        const isHolidayDay = isNationalHoliday(date) || isReligiousHoliday(date)
        isHoliday = isHolidayDay
        isVacation = isDateInVacationRanges(date)
        isWeekend = FRENCH_WEEKEND.includes(date.getDay())
        dayCounter++
      }

      row.push({
        date,
        day: date.getDate(),
        isHoliday,
        isVacation,
        isWeekend,
        label: formatDate(date),
      })
    }
    days.push(row)
  }

  const currentDate = new Date()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">{t('parents.kicker')}</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-(--color-text) sm:text-5xl">
          {t('parents.calendrier')}
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-(--color-text-secondary)">
          Calendrier académique et événements.
        </p>

        {/* En-tête du calendrier */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-(--color-text)">
              {monthNames[currentMonth]}
            </h2>
            <p className="text-sm text-gray-500">
              {currentYear}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium transition"
            >
              ←
            </button>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium transition"
            >
              →
            </button>
          </div>
        </div>

        {/* Jours de la semaine */}
        <div className="mt-4 grid grid-cols-7 gap-2">
          {dayNames.map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Jours du calendrier */}
        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.map((row) => (
            row.map((day) => {
              const date = day.date
              const isHoliday = day.isHoliday
              const isVacation = day.isVacation
              const isWeekend = day.isWeekend
              const isToday = date.getDate() === currentDate.getDate() &&
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear()

              let className = 'p-2 text-center text-sm font-medium rounded-lg transition'
              let textClass = 'text-gray-700'
              let bgClass = 'bg-white'

              if (isHoliday) {
                bgClass += ' bg-red-50 border border-red-300 text-red-700'
                textClass += ' text-red-700 font-semibold'
              } else if (isVacation) {
                bgClass += ' bg-amber-50 border border-amber-300 text-amber-700'
                textClass += ' text-amber-700'
              } else if (isWeekend) {
                bgClass += ' bg-slate-50 border border-slate-200 text-gray-500'
                textClass += ' text-gray-500'
              } else {
                bgClass += ' bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                textClass += ' text-gray-800'
              }

              if (isToday) {
                bgClass += ' ring-2 ring-blue-500 ring-offset-1'
                textClass += ' font-bold'
              }

              return (
                <div
                  key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                  className={`${className} ${bgClass} ${textClass}`}
                >
                  <div className="text-xs font-medium text-gray-500">
                    {day.day}
                  </div>
                  <div className="text-xs">
                    {isHoliday ? '🎉' : isVacation ? '🏖️' : ''}
                  </div>
                </div>
              )
            })
          ))}
        </div>

        {/* Légende */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            Férié
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Vacances
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-slate-500"></span>
            Week-end
          </span>
        </div>
      </section>
    </main>
  )
}
