console.log("StudentsContext loaded")
import { createContext, useContext, useState, useEffect, useCallback } from "react";
//import {students as initialStudents} from '../data/mockData'
import * as api from '../api'

const StudentsContext = createContext(null)
/*let nextId = Math.max(...initialStudents.map(s => s.id)) + 1
export function StudentsProvider({ children }) {
    const [students, setStudents] = useState(initialStudents)
  
    function addStudent(data) {
      const student = { ...data, id: nextId++ }
      setStudents(prev => [...prev, student])
    }
  
    function updateStudent(id, data) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
    }
  
    function deleteStudent(id) {
      console.log("deleting id: ", id, typeof id)
      setStudents(prev => {
        const next = prev.filter(s => s.id !== id)
        console.log("before: ", prev.length, "after: ", next.length)
        return next})
    }
    console.log('Provider value:', { students: students.length, addStudent: typeof addStudent })
    return (
        <StudentsContext.Provider value={{ students, addStudent, updateStudent, deleteStudent }}>
          {children}
        </StudentsContext.Provider>
      )
}

export function useStudents() {
    const ctx = useContext(StudentsContext)
    console.log('useStudents called, ctx:', ctx)
    return ctx
}*/

/*const STORAGE_KEY = 'ua_students'

function loadStudents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : initialStudents
  } catch {
    return initialStudents
  }
}

let nextId = Math.max(...loadStudents().map(s => s.id)) + 1

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState(loadStudents)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  }, [students])

  function addStudent(data) {
    const student = { ...data, id: nextId++ }
    setStudents(prev => [...prev, student])
  }

  function updateStudent(id, data) {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  function deleteStudent(id) {
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  return (
    <StudentsContext.Provider value={{ students, addStudent, updateStudent, deleteStudent }}>
      {children}
    </StudentsContext.Provider>
  )
}*/

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([])
  const [grades, setGrades]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, g] = await Promise.all([api.fetchStudents(), api.fetchGrades()])
      setStudents(s)
      setGrades(g)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function getStudentGpa(studentId) {
    const sg = grades.filter(g => g.student_id === studentId)
    if (!sg.length) return null
    const avg = sg.reduce((sum, g) => sum + g.score, 0) / sg.length
    return Math.round(avg * 10) / 10
  }

  function getStatus(gpa) {
    if (gpa === null) return 'normal'
    if (gpa >= 90) return 'excellent'
    if (gpa >= 65) return 'normal'
    if (gpa >= 60) return 'weak'
    return 'risk'
  }

  const enriched = students.map(s => {
    const gpa = getStudentGpa(s.id)
    const name = `${s.last_name} ${s.first_name}`
    const initials = (s.last_name[0] + s.first_name[0]).toUpperCase()
    return {
      ...s,
      name,
      initials,
      gpa,
      status: getStatus(gpa),
    }
  })

async function addStudent(data) {
    const res = await api.createStudent(data)
    await load()
    return res
}

async function editStudent(id, data) {
    await api.updateStudent(id, data)
    await load()
}

async function removeStudent(id) {
    await api.deleteStudent(id)
    await load()
}

return (
    <StudentsContext.Provider value={{
      students: enriched,
      grades,
      loading,
      error,
      reload: load,
      addStudent,
      editStudent,
      removeStudent,
    }}>
      {children}
    </StudentsContext.Provider>
  )
}

export function useStudents() {
  return useContext(StudentsContext)
}