import { useState, useMemo } from 'react'

import styles from './DatePicker.styles.module.css'

interface DatePickerProps{
  value: Date
  onChange: (value: Date) => void
  min?: Date
  max?: Date
}


const months:string[] = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const daysOfTheWeek: string[] = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun']

interface DateCellItem{
  date: number 
  month: number
  year: number
}

const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1)
  nextMonthDate.setMinutes(-1)
  const lastMonthDate = nextMonthDate.getDate()

  return lastMonthDate
}

const sundayWeekToMondayWeekDayToMap: Record<number, number> = {
  0:6,
  1:0,
  2:1,
  3:2,
  4:3,
  5:4,
  6:5,
}

const getDayOfTheWeek = (date: Date) => {
  const day = date.getDay()

  return sundayWeekToMondayWeekDayToMap[day]
}

const getPreviousMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1)
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay)

  const daysAmountInPrevMonth = getDaysAmountInAMonth(year, month - 1)

  const dateCells: DateCellItem[] = []
  console.log(month);
  

  const [cellYear, cellMonth] = 
    month === 0 ? [year - 1, 11] : [year, month - 1]

  for (let i = 0; i < prevMonthCellsAmount; i++) {
    dateCells.unshift({
      year: cellYear,
      month: cellMonth,
      date: daysAmountInPrevMonth - i
    })
  }
  return dateCells
}

const VISIBLE_CELLS_AMOUNT = 7 * 6

const getNextMonthDays = (year: number, month: number) => {
  //TODO copy paste
  const currentMonthFirstDay = new Date(year, month, 1)
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay)
  //TODO end copy paste

  const daysAmount = getDaysAmountInAMonth(year, month)

  const [cellYear, cellMonth] = 
    month === 11 ? [year + 1, 0] : [year, month + 1]

  const dateCells: DateCellItem[] = []

  const nextMonthDays = 
    VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthCellsAmount 

  for (let i = 1; i <= nextMonthDays; i++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      date: i
    })
  }
  return dateCells
}

const getCurrentMonthDays = (year: number, month: number, numberOfDays: number) => {
  const dateCells: DateCellItem[] = []

  for (let i = 1; i <= numberOfDays; i++) {
    dateCells.push({
      year,
      month,
      date: i
    })
  }

  return dateCells  
}

export const DatePicker = ({value, onChange, min, max}: DatePickerProps) => {

  const [panelYear, setPanelYear] = useState(() => value.getFullYear())
  const [panelMonth, setPanelMonth] = useState(() => value.getMonth())

  const [year, month, date] = useMemo(() => {
    const currentYear = value.getFullYear()
    const currentMonth = value.getMonth()
    const currentDay = value.getDate()

    return[currentYear, currentMonth, currentDay]
  }, [value])

  const dateCells = useMemo(() => {

    const daysInAMonth = getDaysAmountInAMonth(panelYear, panelMonth)
    
    const currentMonthDays = getCurrentMonthDays(panelYear, panelMonth, daysInAMonth)

    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth)
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth)
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [panelYear, panelMonth, ])
  
  const onDateSelect = (item: DateCellItem) => {
    onChange(new Date(item.year, item.month, item.date))
  }

  const nextYear = () => {
    setPanelYear(panelYear + 1)
  }

  const prevYear = () => {
    setPanelYear(panelYear - 1)
  }

  const nextMonth = () => {
    setPanelMonth(month => month + 1)
  }

  const prevMonth = () => {
    setPanelMonth(month => month - 1)
  }


  return (
    <div style={{padding: '12px'}}>
      <div>
        <div>{months[panelMonth]},{panelYear}</div>
      </div>
      <div>
        <button onClick={prevYear}>Prev Year</button>
        <button onClick={prevMonth}>Prev Month</button>
        <button onClick={nextMonth}>Next Month</button>
        <button onClick={nextYear}>Next Year</button>
      </div>
      <div className={styles.calendarPanel}>
        {daysOfTheWeek.map(weekDay => (
          <div key={weekDay} className={styles.calendarPanelItem}>{weekDay}</div>
        ))}
        {dateCells.map(cell => {
          const isCurrentDate = cell.year === year && cell.month === month && cell.date === date
          return (
            <div 
              className={`${styles.calendarPanelItem} ${isCurrentDate ? styles.selectedDate: ''}`}
              key={`${cell.date}.${cell.month}.${cell.year}`}
              onClick={() => onDateSelect(cell)}
            >
              {cell.date}
            </div>
          )
        })}
      </div>
    </div>
  )
}
