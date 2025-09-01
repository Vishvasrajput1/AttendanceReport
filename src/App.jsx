import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AttendanceTable from "./components/AttendanceTable";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AttendanceTable />
    </>
  )
}

export default App
