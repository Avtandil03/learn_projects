import { useState } from 'react'
import './App.css'
import { DatePicker } from './components/DatePicker'

function App() {

  const [date, setDate] = useState(() => new Date())

  return (
    <div>
      <DatePicker value={date} onChange={setDate}/>
    </div>
  )
}

export default App
