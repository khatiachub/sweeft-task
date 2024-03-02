import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import History from './pages/History'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage/>}/>
      <Route path='/history' element={<History/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
