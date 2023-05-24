
export interface DateCellItem{
  date: number 
  month: number
  year: number
}

export const months:string[] = 
  ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const daysOfTheWeek: string[] = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun']

const VISIBLE_CELLS_AMOUNT = 7 * 6

const sundayWeekToMondayWeekDayToMap: Record<number, number> = {
  0:6,
  1:0,
  2:1,
  3:2,
  4:3,
  5:4,
  6:5,
}


export const getDaysAmountInAMonth = (year: number, month: number) => {
  const nextMonthDate = new Date(year, month + 1, 1)
  nextMonthDate.setMinutes(-1)
  const lastMonthDate = nextMonthDate.getDate()

  return lastMonthDate
}


const getDayOfTheWeek = (date: Date) => {
  const day = date.getDay()

  return sundayWeekToMondayWeekDayToMap[day]
}

export const getPreviousMonthDays = (year: number, month: number) => {
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


export const getNextMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1)
  const prevMonthCellsAmount = getDayOfTheWeek(currentMonthFirstDay)

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

export const getCurrentMonthDays = (year: number, month: number, numberOfDays: number) => {
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
