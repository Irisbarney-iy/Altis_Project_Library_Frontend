export function unmaskDigits(value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}

export function formatDateToISO(dateBr: string | null | undefined): string {
  if (!dateBr) return ''
  const [day, month, year] = dateBr.split('/')
  if (!day || !month || !year) return ''
  return `${year}-${month}-${day}`
}

export function isValidGmail(email: string): boolean {
  if (!email) return false
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
  return gmailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  if (!password) return false
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,15}$/
  return passwordRegex.test(password)
}

export function isValidCPF(cpf: string): boolean {
  const cleanCpf = unmaskDigits(cpf)
  if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) return false

  let sum = 0
  let remainder: number

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false

  return true
}
export function isPastDate(dateBr: string): boolean {
  if (!dateBr || dateBr.length < 10) return false
  const [day, month, year] = dateBr.split('/').map(Number)
  if (!day || !month || !year) return false

  const birthDate = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return birthDate < today
}

export function isMinimumAge(dateBr: string, minAge = 6): boolean {
  if (!dateBr || dateBr.length < 10) return false
  const [day, month, year] = dateBr.split('/').map(Number)
  if (!day || !month || !year) return false

  const birthDate = new Date(year, month - 1, day)
  if (isNaN(birthDate.getTime())) return false

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age >= minAge
}