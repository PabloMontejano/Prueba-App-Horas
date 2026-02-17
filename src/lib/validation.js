export function validateEmail(email) {
  if (!email) return null
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? null : 'Please enter a valid email address'
}

export function validateRequired(value, fieldName) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export function validateUrl(url) {
  if (!url) return null
  try {
    new URL(url)
    return null
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com)'
  }
}

export function validateNumericRange(value, min, max, fieldName) {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  if (isNaN(num)) return `${fieldName} must be a number`
  if (min !== undefined && num < min) return `${fieldName} must be at least ${min}`
  if (max !== undefined && num > max) return `${fieldName} must be at most ${max}`
  return null
}

const validators = {
  required: (value, fieldName) => validateRequired(value, fieldName),
  email: (value) => validateEmail(value),
  url: (value) => validateUrl(value),
  numeric: (value, fieldName, rule) =>
    validateNumericRange(value, rule.min, rule.max, fieldName),
}

export function validateForm(values, rules) {
  const errors = {}
  let isValid = true

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = values[fieldName]

    for (const rule of fieldRules) {
      const type = typeof rule === 'string' ? rule : rule.type
      const validator = validators[type]
      if (!validator) continue

      const error = validator(value, fieldName, rule)
      if (error) {
        errors[fieldName] = error
        isValid = false
        break
      }
    }
  }

  return { isValid, errors }
}
