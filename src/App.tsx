import {HashRouter, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import History from './pages/History'

function App() {
 
  return (
    <HashRouter >
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      <Route path='/history' element={<History/>}/>
    </Routes>
    </HashRouter>
  )
}

export default App
