export const getPassLength = (password) => {
  let strength = 0;
  if (password.length >= 6) {
    strength += 1;
  }
  // if (/[a-z]/.test(password)) {
  //   strength += 1;
  // }
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  if (/[0-9]/.test(password)) {
    strength += 1;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 1;
  }
  return strength;
}

export const isPass = (type,value) => { 
  return type === 'password' && value
}

export const safeJsonParse = (raw, defaultValue = {}) => {
  if (raw && typeof raw === 'object') {
    return raw;
  }

  // null or undefined -> fallback
  if (raw == null) {
    return defaultValue;
  }

  const text = String(raw).trim();

  // Common bad values
  if (!text || text === 'undefined' || text === 'null') {
    return defaultValue;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Invalid JSON for bBlocksInputField:', e, text);
    return defaultValue;
  }
}
