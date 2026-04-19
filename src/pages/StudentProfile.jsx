import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
//import { studentDetails } from '../data/mockData'
import { useStudents } from '../context/StudentsContext'
import './StudentProfile.css'

const statusLabel = {
  excellent: { text: 'Відмінник', cls: 'badge-success' },
  risk: { text: 'Ризик', cls: 'badge-danger' },
  weak: { text: 'Слабкий', cls: 'badge-warning' },
  normal: { text: 'Норма', cls: 'badge-info' },
}

export default function StudentProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { students, grades, loading } = useStudents()
    if (loading) return <div className="page-loading">Loading...</div>
    const student = students.find(s => s.id === id)
    //const details = studentDetails[Number(id)]

    if (!student) return (
        <div className="profile-not-found">
          <p>Студента не знайдено.</p>
          <button onClick={() => navigate('/students')}>← Назад до списку</button>
        </div>
    )

    const studentGrades = grades.filter(g => g.student_id === id)
    const byMonth = {}
    studentGrades.forEach(g => {
      const month = g.date.slice(0, 7)
      if (!byMonth[month]) byMonth[month] = []
      byMonth[month].push(g.score)
    })
    const trendData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, scores]) => ({
        month,
        gpa: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10,
      }))
      const lineColor = student.gpa >= 75 ? '#378ADD' : student.gpa >= 60 ? '#BA7517' : '#E24B4A'
      const st = statusLabel[student.status] || statusLabel.normal

      return (
        <div className="profile-page">
          <button className="back-btn" onClick={() => navigate('/students')}>← Назад до списку</button>
    
          <div className="card profile-header-card">
            <div className="profile-avatar">{student.initials}</div>
            <div className="profile-info">
              <div className="profile-name">{student.name}</div>
              <div className="profile-meta">
                {student.group_code} · Рік вступу: {student.enrollment_year} · {student.email}
              </div>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="ps-value">{student.gpa ?? '—'}</div>
                  <div className="ps-label">Середній бал</div>
                </div>
                <div className="profile-stat">
                  <div className="ps-value">{student.absences}</div>
                  <div className="ps-label">Пропуски</div>
                </div>
                <div className="profile-stat">
                  <div className="ps-value">{studentGrades.length}</div>
                  <div className="ps-label">Оцінок</div>
                </div>
              </div>
            </div>
            <span className={`badge ${st.cls}`} style={{ fontSize: 12, padding: '6px 14px' }}>
              {st.text}
            </span>
          </div>
    
          <div className="profile-grid">
            <div className="card">
              <div className="card-header"><span className="card-title">Оцінки</span></div>
              {studentGrades.length === 0
                ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Оцінок ще немає</p>
                : studentGrades.map((g, i) => {
                    const barColor = g.score >= 90 ? 'var(--green)' : g.score >= 75 ? 'var(--blue)' : g.score >= 60 ? 'var(--amber)' : 'var(--red)'
                    return (
                      <div key={i} className="subject-row">
                        <span className="subject-name">{g.grade_type}</span>
                        <div className="subject-bar-wrap">
                          <div className="subject-bar" style={{ width: `${g.score}%`, background: barColor }} />
                        </div>
                        <span className="subject-score">{g.score}</span>
                      </div>
                    )
                  })
              }
            </div>
    
            <div className="card">
              <div className="card-header"><span className="card-title">Динаміка по місяцях</span></div>
              {trendData.length < 2
                ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Недостатньо даних для графіку</p>
                : <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
                        formatter={v => [v, 'Сер. бал']} />
                      <Line dataKey="gpa" stroke={lineColor} strokeWidth={2}
                        dot={{ r: 4, fill: lineColor }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
              }
            </div>
          </div>
        </div>
      )
}