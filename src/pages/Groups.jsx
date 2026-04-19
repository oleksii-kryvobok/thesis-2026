import {useEffect, useState} from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
//import MetricCard from '../components/MetricCard'
//import { groups } from '../data/mockData'
import { useStudents } from '../context/StudentsContext'
import { fetchDashboard, fetchRiskGroup } from '../api'
import './Groups.css'
  
const GROUP_COLORS = ['#378ADD', '#BA7517', '#639922', '#7F77DD', '#E24B4A']

const badgeClass = (n, type) => {
  if (type === 'risk')      return n >= 5 ? 'badge-danger' : 'badge-warning'
  if (type === 'excellent') return n >= 5 ? 'badge-success' : 'badge-info'
  return ''
}

export default function Groups() {
  const { students } = useStudents()
  const [analytics, setAnalytics] = useState(null)
  const [riskGroup, setRiskGroup] = useState(null)

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchRiskGroup()])
      .then(([a, r]) => { setAnalytics(a); setRiskGroup(r) })
      .catch(() => {})
  }, [])

  // Build group stats from live students
  const groupMap = {}
  students.forEach(s => {
    if (!groupMap[s.group_code]) groupMap[s.group_code] = { name: s.group_code, students: [] }
    groupMap[s.group_code].students.push(s)
  })

  const groupStats = Object.values(groupMap).map(g => {
    const withGpa     = g.students.filter(s => s.gpa !== null)
    const gpa         = withGpa.length ? withGpa.reduce((a, s) => a + s.gpa, 0) / withGpa.length : 0
    const risk        = g.students.filter(s => s.status === 'risk').length
    const excellent   = g.students.filter(s => s.status === 'excellent').length
    const absences    = g.students.reduce((a, s) => a + (s.absences || 0), 0) / g.students.length
    return { name: g.name, count: g.students.length, gpa: Math.round(gpa * 10) / 10, risk, excellent, absences: Math.round(absences * 10) / 10 }
  }).sort((a, b) => b.gpa - a.gpa)

  // Subject comparison data from analytics
  const subjectData = analytics?.average_score_by_subject
    ? Object.entries(analytics.average_score_by_subject).map(([subject, score]) => ({ subject, score }))
    : []

  const best  = groupStats[0]
  const worst = groupStats[groupStats.length - 1]

  return (
    <div className="groups-page">
      <div className="groups-metrics">
        {groupStats.map(g => (
          <div key={g.name} className="metric-card">
            <div className="metric-label">{g.name}</div>
            <div className="metric-value">{g.gpa || '—'}</div>
            <div className="metric-change neutral">{g.count} студентів</div>
          </div>
        ))}
      </div>

      <div className="groups-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Середній бал по предметах</span></div>
          {subjectData.length === 0
            ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Немає даних — додайте оцінки</p>
            : <ResponsiveContainer width="100%" height={260}>
                <BarChart data={subjectData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
                    formatter={v => [v, 'Середній бал']} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {subjectData.map((_, i) => (
                      <rect key={i} fill={GROUP_COLORS[i % GROUP_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Зведена таблиця груп</span></div>
          {groupStats.length === 0
            ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Немає студентів</p>
            : <>
                <table className="groups-table">
                  <thead>
                    <tr><th>Група</th><th>Сер. бал</th><th>Ризик</th><th>Відм.</th><th>Пропуски</th></tr>
                  </thead>
                  <tbody>
                    {groupStats.map(g => (
                      <tr key={g.name}
                        className={g.name === best?.name ? 'row-best' : g.name === worst?.name && groupStats.length > 1 ? 'row-worst' : ''}>
                        <td><strong>{g.name}</strong></td>
                        <td>{g.gpa}</td>
                        <td><span className={`badge ${badgeClass(g.risk, 'risk')}`}>{g.risk}</span></td>
                        <td><span className={`badge ${badgeClass(g.excellent, 'excellent')}`}>{g.excellent}</span></td>
                        <td>{g.absences}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {groupStats.length > 1 && (
                  <div className="groups-table-legend">
                    <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--green-light)', border: '1px solid var(--green)' }} />Найкраща</span>
                    <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--red-light)', border: '1px solid var(--red)' }} />Найслабша</span>
                  </div>
                )}
              </>
          }
        </div>
      </div>
    </div>
  )
}