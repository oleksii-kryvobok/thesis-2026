import {useEffect, useState} from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
//import MetricCard from '../components/MetricCard'
//import { semesterTrend, subjectComparison, scoreDistribution } from '../data/mockData'
import { fetchDashboard } from '../api'
import { useStudents } from '../context/StudentsContext'
import './Trends.css'
  
const distColors = ['var(--green)', 'var(--blue)', 'var(--amber)', 'var(--red)']
  
export default function Trends() {
    const { students } = useStudents()
    const [analytics, setAnalytics] = useState(null)

    useEffect(() => {
      fetchDashboard().then(setAnalytics).catch(() => {})
    }, [])

    // Score distribution from live students
    const dist = [
      { range: '90–100', count: students.filter(s => s.gpa >= 90).length },
      { range: '75–89',  count: students.filter(s => s.gpa >= 75 && s.gpa < 90).length },
      { range: '60–74',  count: students.filter(s => s.gpa >= 60 && s.gpa < 75).length },
      { range: 'до 60',  count: students.filter(s => s.gpa !== null && s.gpa < 60).length },
    ]

    const subjectData = analytics?.average_score_by_subject
      ? Object.entries(analytics.average_score_by_subject).map(([subject, score]) => ({ subject, score }))
      : []

    const groupData = analytics?.avarege_score_by_group
      ? Object.entries(analytics.avarege_score_by_group).map(([name, gpa]) => ({ name, gpa }))
      : []

    const bestSubject  = subjectData.length ? subjectData.reduce((a, b) => a.score > b.score ? a : b) : null
    const worstSubject = subjectData.length ? subjectData.reduce((a, b) => a.score < b.score ? a : b) : null

    return (
      <div className="trends-page">
        <div className="trends-metrics">
          <div className="metric-card">
            <div className="metric-label">Всього студентів</div>
            <div className="metric-value">{students.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Найкращий предмет</div>
            <div className="metric-value" style={{ fontSize: 16 }}>{bestSubject?.subject ?? '—'}</div>
            {bestSubject && <div className="metric-change up">Сер. бал {bestSubject.score}</div>}
          </div>
          <div className="metric-card">
            <div className="metric-label">Найслабший предмет</div>
            <div className="metric-value" style={{ fontSize: 16 }}>{worstSubject?.subject ?? '—'}</div>
            {worstSubject && <div className="metric-change down">Сер. бал {worstSubject.score}</div>}
          </div>
          <div className="metric-card">
            <div className="metric-label">Груп в системі</div>
            <div className="metric-value">{groupData.length}</div>
          </div>
        </div>

        <div className="trends-grid-top">
          <div className="card">
            <div className="card-header"><span className="card-title">Середній бал по групах</span></div>
            {groupData.length === 0
              ? <p style={{ color: 'var(--text-hint)', fontSize: 13 }}>Немає даних</p>
              : <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={groupData} barSize={36}>
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
            <div className="card-header"><span className="card-title">Розподіл студентів за балами</span></div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dist} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
                  formatter={v => [v, 'Студентів']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {dist.map((_, i) => <Cell key={i} fill={distColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {subjectData.length > 0 && (
          <div className="card">
            <div className="card-header"><span className="card-title">Середній бал по предметах</span></div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={subjectData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6B6B67' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)' }}
                  formatter={v => [v, 'Середній бал']} />
                <Bar dataKey="score" fill="#378ADD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    )
}