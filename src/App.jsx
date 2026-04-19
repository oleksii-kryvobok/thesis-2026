import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students"
import StudentProfile from "./pages/StudentProfile"
import Trends from "./pages/Trends"
import Groups from "./pages/Groups"
import Login from "./pages/Login"
import './App.css'

function Layout({title, children}) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar
          title={title}
          subtitle="2025/26 Semester 2"
        />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute><Layout title="Dashboard"><Dashboard /></Layout></ProtectedRoute>
          } />
        <Route path="/students" element={
          <ProtectedRoute><Layout title="Students"><Students /></Layout></ProtectedRoute>
          } />
        <Route path="/students/:id" element={
          <ProtectedRoute><Layout title="Students"><StudentProfile /></Layout></ProtectedRoute>
          } />
        <Route path="/trends" element={
          <ProtectedRoute><Layout title="Grade dynamics"><Trends /></Layout></ProtectedRoute>
          } />
        <Route path="/groups" element={
          <ProtectedRoute><Layout title="Group comparison"><Groups /></Layout></ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  )
}