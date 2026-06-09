import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts'
import MetricCard from '../components/MetricCard'
import { fetchDashboard, fetchRiskGroup } from '../api'
import { useStudents } from '../context/StudentsContext'
//import { dashboardStats, groups } from '../data/mockData'
import './Dashboard.css'

/*const radarData = [
    { subject: 'Алгоритми', score: 72 },
    { subject: 'Математика', score: 68 },
    { subject: 'БД',         score: 79 },
    { subject: 'Мережі',     score: 75 },
    { subject: 'ОС',         score: 70 },
]

const statusLabel = {
    excellent: { text: 'Відмінник', cls: 'badge-success' },
    risk: { text: 'Ризик',     cls: 'badge-danger' },
    weak: { text: 'Слабкий',   cls: 'badge-warning' },
    normal: { text: 'Норма',     cls: 'badge-info' },
}*/

export default function Dashboard() {
    const navigate = useNavigate()
    const {students} = useStudents()
    const [analytics, setAnalytics] = useState(null)
    const [riskGroup, setRiskGroup] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        Promise.all([fetchDashboard(), fetchRiskGroup()])
          .then(([a, r]) => { setAnalytics(a); setRiskGroup(r) })
          .catch(() => {})
          .finally(() => setLoading(false))
    }, [])
    
    // Derived metrics from live students
    const totalStudents = students.length
    const gpas          = students.filter(s => s.gpa !== null).map(s => s.gpa)
    const averageGpa    = gpas.length ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(1) : '—'
    const atRiskCount   = students.filter(s => s.status === 'risk').length
    const excellentCount= students.filter(s => s.status === 'excellent').length
    
    // Group bar chart data from analytics
    const groupChartData = analytics?.avarege_score_by_group
        ? Object.entries(analytics.avarege_score_by_group).map(([name, gpa]) => ({ name, gpa }))
        : []
    
    // Subject radar data from analytics
    const radarData = analytics?.average_score_by_subject
        ? Object.entries(analytics.average_score_by_subject).map(([subject, score]) => ({ subject, score }))
        : []
    
    // At-risk students from API
    const atRiskStudents = riskGroup?.students_at_risk || []
    
    if (loading) return <div className="page-loading">Завантаження аналітики...</div>
    
    return (
        <div className="dashboard">
          <div className="metrics-row">
            <MetricCard label="Всього студентів" value={totalStudents} change="Активні записи" changeType="neutral" />
            <MetricCard label="Середній бал"     value={averageGpa}    change="За всіма оцінками" changeType="neutral" />
            <MetricCard label="Під ризиком"      value={atRiskCount}   change="Середній бал < 60" changeType={atRiskCount > 0 ? 'down' : 'up'} />
            <MetricCard label="Відмінники (90+)" value={excellentCount} change="Середній бал ≥ 90" changeType="up" />
          </div>
    
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Середній бал по групах</span>
              </div>
              {groupChartData.length === 0
                ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Немає даних - додайте оцінки</p>
                : <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={groupChartData} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
                        formatter={v => [v, 'Середній бал']} />
                      <Bar dataKey="gpa" fill="#378ADD" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
              }
            </div>
    
            <div className="card">
              <div className="card-header">
                <span className="card-title">Під ризиком відрахування</span>
                <span className="card-action" onClick={() => navigate('/students')}>Всі →</span>
              </div>
              {atRiskStudents.length === 0
                ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Студентів під ризиком немає</p>
                : <div className="at-risk-list">
                    {atRiskStudents.map(s => (
                      <div key={s.student_id} className="at-risk-item"
                        onClick={() => navigate(`/students/${s.student_id}`)}>
                        <div className="ari-avatar">{(s.full_name || '??').split(' ').map(w => w[0]).join('').toUpperCase()}</div>
                        <div className="ari-info">
                          <div className="ari-name">{s.full_name}</div>
                          <div className="ari-meta">{s.group_code}</div>
                        </div>
                        <span className="badge badge-danger">{s.score} балів</span>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
    
          {radarData.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Загальна успішність по предметах</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6B6B67' }} />
                  <Radar dataKey="score" stroke="#378ADD" fill="#378ADD" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
                    formatter={v => [v, 'Бал']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
    )
}
