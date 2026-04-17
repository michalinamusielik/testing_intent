import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { Aktywnosci } from './pages/Aktywnosci'
import { Ankieta } from './pages/Ankieta'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Aktywnosci />} />
          <Route path="ankieta" element={<Ankieta />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
