import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../context/StudentsContext';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import './Students.css'

const statusLabel = {
    excellent: { text: 'Відмінник', cls: 'badge-success' },
    risk: { text: 'Ризик', cls: 'badge-danger' },
    weak: { text: 'Слабкий', cls: 'badge-warning' },
    normal: { text: 'Норма', cls: 'badge-info' },
  }
  
const avatarColors = {
    excellent: { bg: '#E6F1FB', color: '#0C447C' },
    risk: { bg: '#FCEBEB', color: '#A32D2D' },
    weak: { bg: '#FAEEDA', color: '#854F0B' },
    normal: { bg: '#E1F5EE', color: '#085041' },
}
  
export default function Students() {
  const navigate = useNavigate()
  const { students, loading, error, addStudent, editStudent, removeStudent } = useStudents()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [groupFilter, setGroup] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const groups = [...new Set(students.map(s => s.group_code))].sort()

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.group_code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchGroup  = groupFilter  === 'all' || s.group_code  === groupFilter
    return matchSearch && matchStatus && matchGroup
  })

  async function handleAdd(data) {
    setSaving(true)
    setSaveError('')
    console.log('handleAdd called, data:', data, 'addStudent:', typeof addStudent)
    //if (!showAdd) return
    //addStudent(data)
    //setShowAdd(false)
    try {
      const res = await addStudent(data)
      setShowAdd(false)
      if (res.credentials) setCredentials(res.credentials)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

  /*function handleEdit(data) {
    updateStudent(editTarget.id, data)
    setEditTarget(null)
  }*/

  async function handleEdit(data) {
      if (!editTarget) return
      setSaving(true)
      setSaveError('')
      try {
        await editStudent(editTarget.id, data)
        setEditTarget(null)
      } catch (e) {
        setSaveError(e.message)
      } finally {
        setSaving(false)
      }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      await removeStudent(deleteTarget.id)
      setDeleteTarget(null)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

    if (loading) return <div className="page-loading">Завантаження студентів...</div>
    if (error) return <div className="page-error">Помилка: {error}</div>

    return (
      <div className="students-page">
        <div className="students-toolbar">
          <input className="search-input" type="text"
            placeholder="Пошук за ім'ям або групою..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="toolbar-select" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="all">Всі статуси</option>
            <option value="excellent">Відмінники</option>
            <option value="normal">Норма</option>
            <option value="weak">Слабкі</option>
            <option value="risk">Під ризиком</option>
          </select>
          <select className="toolbar-select" value={groupFilter} onChange={e => setGroup(e.target.value)}>
            <option value="all">Всі групи</option>
            {groups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <span className="students-count">{filtered.length} студентів</span>
          <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => { setSaveError(''); setShowAdd(true) }}>
            + Додати студента
          </button>
        </div>
  
        <div className="card">
          <table className="students-table">
            <thead>
              <tr>
                <th>Студент</th>
                <th>Група</th>
                <th>Рік вступу</th>
                <th>Середній бал</th>
                <th>Пропуски</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="table-empty">Нічого не знайдено</td></tr>
                : filtered.map(s => {
                    const av = avatarColors[s.status] || avatarColors.normal
                    return (
                      <tr key={s.id} onClick={() => navigate(`/students/${s.id}`)}>
                        <td>
                          <div className="student-name-cell">
                            <div className="st-avatar" style={{ background: av.bg, color: av.color }}>{s.initials}</div>
                            {s.name}
                          </div>
                        </td>
                        <td>{s.group_code}</td>
                        <td>{s.enrollment_year}</td>
                        <td><strong>{s.gpa ?? '—'}</strong></td>
                        <td>{s.absences}</td>
                        <td><span className={`badge ${statusLabel[s.status].cls}`}>{statusLabel[s.status].text}</span></td>
                        <td>
                          <div className="row-actions" onClick={e => e.stopPropagation()}>
                            <button className="row-btn" onClick={() => { setSaveError(''); setEditTarget(s) }}>Ред.</button>
                            <button className="row-btn row-btn-danger" onClick={() => setDeleteTarget(s)}>Вид.</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
  
        {showAdd && (
          <Modal title="Додати студента" onClose={() => setShowAdd(false)}>
            {saveError && <div className="login-error" style={{ marginBottom: 0 }}>{saveError}</div>}
            <StudentForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)}
              submitLabel={saving ? 'Збереження...' : 'Додати'} />
          </Modal>
        )}
  
        {editTarget && (
          <Modal title="Редагувати студента" onClose={() => setEditTarget(null)}>
            {saveError && <div className="login-error" style={{ marginBottom: 0 }}>{saveError}</div>}
            <StudentForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)}
              submitLabel={saving ? 'Збереження...' : 'Зберегти зміни'} />
          </Modal>
        )}
  
        {deleteTarget && (
          <Modal title="Видалити студента" onClose={() => setDeleteTarget(null)}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Ви впевнені, що хочете видалити <strong>{deleteTarget.name}</strong>? Цю дію неможливо скасувати.
            </p>
            <div className="form-actions" style={{ marginTop: 8 }}>
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Скасувати</button>
              <button className="btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Видалення...' : 'Видалити'}
              </button>
            </div>
          </Modal>
        )}
  
        {credentials && (
          <Modal title="Студента створено - дані" onClose={() => setCredentials(null)}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Збережіть ці дані - їх більше не буде показано.
            </p>
            <div className="credentials-box">
              <div className="cred-row"><span>Email</span><strong>{credentials.email}</strong></div>
              <div className="cred-row"><span>Пароль</span><strong>{credentials.password}</strong></div>
            </div>
            <div className="form-actions" style={{ marginTop: 8 }}>
              <button className="btn-primary" onClick={() => setCredentials(null)}>ОК</button>
            </div>
          </Modal>
        )}
      </div>
    )
}
