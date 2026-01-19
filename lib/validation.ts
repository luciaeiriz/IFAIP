/**
 * Validation utilities for security and data integrity
 */

/**
 * Validates if a string is a valid UUID v4
 * @param uuid - The string to validate
 * @returns true if valid UUID, false otherwise
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Validates string length
 * @param value - The string to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error messages
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateLength(
  value: string | null | undefined,
  maxLength: number,
  fieldName: string
): { isValid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { isValid: true }
  }
  if (typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` }
  }
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} exceeds maximum length of ${maxLength} characters`,
    }
  }
  return { isValid: true }
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns true if valid email format, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
