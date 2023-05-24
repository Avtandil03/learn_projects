import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'

import styles from './DatePicker.styles.module.css'
import { 
  DateCellItem, 
  daysOfTheWeek, 
  getCurrentMonthDays, 
  getDaysAmountInAMonth, 
  getNextMonthDays, 
  getPreviousMonthDays, 
  months
} from '../utils/UtillsOfDatePicker'

interface DatePickerProps{
  value: Date
  onChange: (value: Date) => void
  min?: Date
  max?: Date
}

const getInputValueFromDate = (value: Date) => {
  const dateValue = value.getDate()
  const date = dateValue > 9 ? dateValue : `0${dateValue}`
  const monthValue = value.getMonth()
  const month = monthValue > 9 ? monthValue : `0${monthValue}`
  const year = value.getFullYear()
  return `${date}-${month}-${year}`
}

export const DatePicker = ({value, onChange, min, max}: DatePickerProps) => {

  const [showPopup, setShowPopup] = useState(false)
  const datePickerElRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState('')
  //TODO do we need effect
  useLayoutEffect(() => { 
    setInputValue(getInputValueFromDate(value))
  }, [value])

  useEffect(() => {
    const element = datePickerElRef.current

    if(!element) return

    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target

      if(!(target instanceof Node)) return

      if(element.contains(target)) return

      setShowPopup(false)
    }

    document.addEventListener('click', onDocumentClick)

    return () => {
      document.addEventListener('click', onDocumentClick)
    }
  }, [])

  const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const [] = useMemo(() => {

    }, [])
    setInputValue(value)
  }

  const onFocus = () => {
    setShowPopup(true)
  }

  const onBlur = () => {

  }



  return (
    <div ref={datePickerElRef} className={styles.popupWrapper}>
      <input value={inputValue} type="text" onFocus={onFocus} placeholder='DD-MM_YY' />
      {showPopup && (
        <div className={styles.contentWrapper}>
          <DatePickerPopupContent value={value} onChange={onChange} min={min} max={max}/>
        </div>
      )}
    </div>
  )
}

export const DatePickerPopupContent = ({value, onChange}: DatePickerProps) => {

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
