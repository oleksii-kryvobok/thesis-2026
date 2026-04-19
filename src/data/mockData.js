export const students = [
    { id: 1, name: 'Шевченко Олена',    initials: 'ШО', group: 'КН-31', gpa: 88, absences: 2,  status: 'excellent' },
    { id: 2, name: 'Даниленко Михайло', initials: 'ДМ', group: 'КН-31', gpa: 52, absences: 14, status: 'risk' },
    { id: 3, name: 'Іваненко Андрій',   initials: 'ІА', group: 'КН-32', gpa: 76, absences: 3,  status: 'normal' },
    { id: 4, name: 'Мороз Наталія',     initials: 'МН', group: 'МТ-21', gpa: 91, absences: 1,  status: 'excellent' },
    { id: 5, name: 'Кравченко Аліна',   initials: 'КА', group: 'МТ-21', gpa: 58, absences: 9,  status: 'weak' },
    { id: 6, name: 'Бондаренко Василь', initials: 'БВ', group: 'КН-31', gpa: 70, absences: 5,  status: 'normal' },
    { id: 7, name: 'Петренко Сергій',   initials: 'ПС', group: 'КН-32', gpa: 55, absences: 11, status: 'risk' },
    { id: 8, name: 'Левченко Вікторія', initials: 'ЛВ', group: 'КН-31', gpa: 61, absences: 7,  status: 'weak' },
    { id: 9, name: 'Ткаченко Роман',    initials: 'ТР', group: 'МТ-21', gpa: 83, absences: 2,  status: 'normal' },
    { id: 10, name: 'Коваль Юлія',      initials: 'КЮ', group: 'КН-32', gpa: 94, absences: 0,  status: 'excellent' },
  ]
  
  export const studentDetails = {
    1: {
      fullName: 'Шевченко Олена Василівна',
      group: 'КН-31',
      specialty: "Комп'ютерні науки",
      year: 3,
      studentId: '2022-0147',
      rank: 'Топ 12%',
      subjects: [
        { name: 'Алгоритми і структури', score: 92 },
        { name: 'Бази даних',            score: 88 },
        { name: 'Вища математика',        score: 79 },
        { name: 'Операційні системи',     score: 91 },
        { name: "Комп'ютерні мережі",     score: 85 },
        { name: 'Англійська мова',        score: 95 },
      ],
      semesterGpa: [81, 84, 87, 88, 88],
    },
    2: {
      fullName: 'Даниленко Михайло Олегович',
      group: 'КН-31',
      specialty: "Комп'ютерні науки",
      year: 3,
      studentId: '2022-0134',
      rank: 'Низ 15%',
      subjects: [
        { name: 'Алгоритми і структури', score: 48 },
        { name: 'Бази даних',            score: 55 },
        { name: 'Вища математика',        score: 51 },
        { name: 'Операційні системи',     score: 60 },
        { name: "Комп'ютерні мережі",     score: 49 },
        { name: 'Англійська мова',        score: 52 },
      ],
      semesterGpa: [61, 58, 55, 54, 52],
    },
  }
  
  export const groups = [
    { name: 'КН-31', gpa: 78.3, count: 32, risk: 4, excellent: 7, absences: 3.1 },
    { name: 'КН-32', gpa: 71.1, count: 29, risk: 6, excellent: 3, absences: 5.4 },
    { name: 'МТ-21', gpa: 74.4, count: 28, risk: 3, excellent: 5, absences: 4.0 },
    { name: 'МТ-22', gpa: 69.8, count: 31, risk: 5, excellent: 2, absences: 6.2 },
  ]
  
  export const subjectComparison = [
    { subject: 'Алгоритми', current: 74, previous: 71 },
    { subject: 'БД',        current: 79, previous: 76 },
    { subject: 'Математика',current: 68, previous: 65 },
    { subject: 'Мережі',    current: 75, previous: 73 },
    { subject: 'ОС',        current: 70, previous: 68 },
  ]
  
  export const semesterTrend = [
    { semester: 'Сем 1', gpa: 70 },
    { semester: 'Сем 2', gpa: 72 },
    { semester: 'Сем 3', gpa: 71 },
    { semester: 'Сем 4', gpa: 74 },
    { semester: 'Сем 5', gpa: 74 },
  ]
  
  export const scoreDistribution = [
    { range: '90–100', count: 19 },
    { range: '75–89',  count: 48 },
    { range: '60–74',  count: 37 },
    { range: 'до 60',  count: 23 },
  ]
  
  export const dashboardStats = {
    totalStudents: 127,
    averageGpa: 74.2,
    atRisk: 11,
    excellent: 19,
  }