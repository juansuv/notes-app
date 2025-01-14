import { Button, Container, Typography } from '@mui/material'
import Error404 from './containers/errors/error_404'
import Home from './containers/pages/home'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        {/* error display*/}
        <Route path="*" element={<Error404/>} />
        {/* home display*/}
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  )
}

export default App
