import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DesignationPage from './pages/DesignationPage'
import EmployeePage from './pages/EmployeePage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="designations" element={<DesignationPage />} />
            <Route path="employees" element={<EmployeePage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}