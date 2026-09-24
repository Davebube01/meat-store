const NG_PHONE = /^(?:\+?234|0)([789][01]\d{8})$/;

export const MIN_PASSWORD_LENGTH = 8;

export function isValidNgPhone(value: string): boolean {
  return NG_PHONE.test(value.replace(/[\s\-()]/g, ""));
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Too short" | "Weak" | "Fair" | "Good" | "Strong";
  tips: string[];
}

// Only length is enforced (matching the backend); the rest is guidance.
export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { score: 0, label: "Too short", tips: [`Use at least ${MIN_PASSWORD_LENGTH} characters`] };
  }

  const tips: string[] = [];
  let score = 1;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else tips.push("Mix upper and lower case");

  if (/\d/.test(password)) score++;
  else tips.push("Add a number");

  if (/[^A-Za-z0-9]/.test(password) || password.length >= 14) score++;
  else tips.push("Add a symbol or make it longer");

  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;
  return { score: score as PasswordStrength["score"], label: labels[score], tips };
}

// Only allow same-site relative paths, so a crafted ?redirect=https://evil.com
// link can't bounce someone off-site right after they log in.
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
