const BASE = 'https://student-analytics-backend.onrender.com'

function getToken() {
  return localStorage.getItem('auth_token')
}

function authHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function login(email, password) {
  const body = new URLSearchParams({ username: email, password })
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  return handleResponse(res)
}

export async function register(email, password) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(res)
}

export async function fetchStudents() {
  const res = await fetch(`${BASE}/api/students`)
  return handleResponse(res)
}

export async function createStudent(data) {
  const res = await fetch(`${BASE}/api/students`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateStudent(id, data) {
    const res = await fetch(`${BASE}/api/students/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    })
    return handleResponse(res)
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE}/api/students/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function fetchGrades() {
  const res = await fetch(`${BASE}/api/grades`)
  return handleResponse(res)
}

export async function addGrade(data) {
  const res = await fetch(`${BASE}/api/grades`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function fetchSubjects() {
  const res = await fetch(`${BASE}/api/subjects`)
  return handleResponse(res)
}

export async function createSubject(data) {
  const res = await fetch(`${BASE}/api/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function fetchDashboard() {
  const res = await fetch(`${BASE}/api/analytics/dashboard`)
  return handleResponse(res)
}

export async function fetchRiskGroup() {
  const res = await fetch(`${BASE}/api/analytics/risk-group`)
  return handleResponse(res)
}