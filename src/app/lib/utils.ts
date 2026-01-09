export function normalizeUrl(url: string): string {
  // Trim whitespace
  const trimmed = url.trim();

  // Check if URL already has a protocol
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Add https:// as default protocol for URLs without one
  return `https://${trimmed}`;
}

export function isValidUrl(url: string): boolean {
  try {
    const normalized = normalizeUrl(url);
    new URL(normalized);
    return true;
  } catch (error) {
    return false;
  }
}

export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    // Remove any potentially harmful characters or patterns
    return input.replace(/[<>&'"]/g, "")
  } else if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  } else if (typeof input === "object" && input !== null) {
    const sanitizedObject: { [key: string]: any } = {}
    for (const [key, value] of Object.entries(input)) {
      sanitizedObject[key] = sanitizeInput(value)
    }
    return sanitizedObject
  }
  return input
}
