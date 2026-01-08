import React from 'react'
import Tasks from './pages/Tasks'
import Goals from './pages/Goals'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Layout from './layout/layout'
import { Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <div >
  
      
      <Routes element={<Layout/>}>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/tasks' element={<Tasks/>}/>
        <Route path='/goals' element={<Goals/>}/>
        <Route path='/habits' element={<Habits/>}/>
      </Routes>
    </div>
  )
}

export default App
