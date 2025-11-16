/**
 * Input Sanitization Utilities
 *
 * @description Security utilities for sanitizing user input
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous attributes
 */
export function sanitizeHTML(html: string): string {
  // Create a temporary element
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Sanitize text input
 * Removes control characters and trims whitespace
 */
export function sanitizeText(text: string, maxLength = 1000): string {
  return text
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = sanitizeText(email, 254).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize phone number
 * Removes all non-digit characters except +
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '').slice(0, 20);
}

/**
 * Sanitize postal code
 * Allows letters, digits, spaces, and hyphens
 */
export function sanitizePostalCode(postal: string): string {
  return postal
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toUpperCase()
    .slice(0, 15);
}

/**
 * Sanitize URL
 * Ensures URL is safe and valid
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Sanitize filename
 * Removes path traversal attempts and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 255);
}

/**
 * Sanitize date string
 * Returns ISO date string or null if invalid
 */
export function sanitizeDate(dateString: string): string | null {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().split('T')[0];
}

/**
 * Sanitize number input
 * Parses and validates numeric input
 */
export function sanitizeNumber(input: string, min?: number, max?: number): number | null {
  const num = parseFloat(input);

  if (isNaN(num)) {
    return null;
  }

  if (min !== undefined && num < min) {
    return min;
  }

  if (max !== undefined && num > max) {
    return max;
  }

  return num;
}

/**
 * Sanitize form data object
 * Applies appropriate sanitization to each field
 */
export function sanitizeFormData(
  data: Record<string, string>,
  schema: Record<string, 'text' | 'email' | 'phone' | 'postal' | 'date' | 'url'>
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    const type = schema[key] || 'text';

    switch (type) {
      case 'email': {
        const sanitizedEmail = sanitizeEmail(value);
        if (sanitizedEmail) {
          sanitized[key] = sanitizedEmail;
        }
        break;
      }
      case 'phone':
        sanitized[key] = sanitizePhone(value);
        break;
      case 'postal':
        sanitized[key] = sanitizePostalCode(value);
        break;
      case 'date': {
        const sanitizedDate = sanitizeDate(value);
        if (sanitizedDate) {
          sanitized[key] = sanitizedDate;
        }
        break;
      }
      case 'url': {
        const sanitizedURL = sanitizeURL(value);
        if (sanitizedURL) {
          sanitized[key] = sanitizedURL;
        }
        break;
      }
      default:
        sanitized[key] = sanitizeText(value);
    }
  }

  return sanitized;
}

/**
 * Validate input length
 */
export function validateLength(input: string, min: number, max: number): boolean {
  const length = input.trim().length;
  return length >= min && length <= max;
}

/**
 * Check for SQL injection patterns
 * Basic detection - should be used with parameterized queries
 */
export function hasSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
    /(union.*select)/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function hasXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}
