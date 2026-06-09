import { useState } from "react";
import './StudentForm.css'
const emptyForm = {
    first_name: '',
    last_name: '',
    group_code: '',
    enrollment_year: new Date().getFullYear(),
    absences: '',
}

/*function deriveInitials(name) {
    const parts = name.trim().split(' ')
    if (parts.length < 2) return name.slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
}

function deriveStatus(gpa) {
    if (gpa >= 90) return 'excellent'
    if (gpa >= 65) return 'normal'
    if (gpa >= 60) return 'weak'
    return 'risk'
}*/

export default function StudentForm({ initial, onSubmit, onCancel, submitLabel }) {
    const [form, setForm] = useState(initial || emptyForm)
    const [errors, setErrors] = useState({})
  
    function set(field, value) {
      setForm(prev => ({ ...prev, [field]: value}))
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  
    function validate() {
        const e = {}
        if (!form.first_name.trim()) e.first_name = "Введіть ім'я"
        if (!form.last_name.trim()) e.last_name = "Введіть прізвище"
        if (!form.group_code.trim()) e.group_code = "Введіть групу"
        const year = Number(form.enrollment_year)
        if (!year || year < 2000 || year > 2100) e.enrollment_year = "Введіть рік"
        const abs = Number(form.absences)
        if (isNaN(abs) || abs < 0) e.absences = "Невід\'ємне число"
        return e
    }
  
    function handleSubmit() {
        const e = validate()
        if (Object.keys(e).length) { setErrors(e); return }
        onSubmit({
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            group_code: form.group_code.trim(),
            enrollment_year: Number(form.enrollment_year),
            absences: Number(form.absences),
        })
    }
  
    return (
      <>
        <div className="form-2col">
          <div className="form-row">
            <label className="form-label">Прізвище *</label>
            <input className={`form-input ${errors.last_name ? 'input-error' : ''}`}
              value={form.last_name} onChange={e => set('last_name', e.target.value)}
              placeholder="Шевченко" />
            {errors.last_name && <span className="form-error">{errors.last_name}</span>}
          </div>
          <div className="form-row">
            <label className="form-label">Ім'я *</label>
            <input className={`form-input ${errors.first_name ? 'input-error' : ''}`}
              value={form.first_name} onChange={e => set('first_name', e.target.value)}
              placeholder="Олена" />
            {errors.first_name && <span className="form-error">{errors.first_name}</span>}
          </div>
        </div>
  
        <div className="form-row">
          <label className="form-label">Група *</label>
          <input className={`form-input ${errors.group_code ? 'input-error' : ''}`}
            value={form.group_code} onChange={e => set('group_code', e.target.value)}
            placeholder="ПД-44" />
          {errors.group_code && <span className="form-error">{errors.group_code}</span>}
        </div>
  
        <div className="form-2col">
          <div className="form-row">
            <label className="form-label">Рік вступу *</label>
            <input className={`form-input ${errors.enrollment_year ? 'input-error' : ''}`}
              type="number" min="2000" max="2100"
              value={form.enrollment_year} onChange={e => set('enrollment_year', e.target.value)}
              placeholder="2022" />
            {errors.enrollment_year && <span className="form-error">{errors.enrollment_year}</span>}
          </div>
          <div className="form-row">
            <label className="form-label">Пропуски</label>
            <input className={`form-input ${errors.absences ? 'input-error' : ''}`}
              type="number" min="0"
              value={form.absences} onChange={e => set('absences', e.target.value)}
              placeholder="0" />
            {errors.absences && <span className="form-error">{errors.absences}</span>}
          </div>
        </div>
  
        <div className="form-actions">
          <button className="btn-secondary" onClick={onCancel}>Скасувати</button>
          <button className="btn-primary" onClick={handleSubmit}>{submitLabel || 'Зберегти'}</button>
        </div>
      </>
    )
}
