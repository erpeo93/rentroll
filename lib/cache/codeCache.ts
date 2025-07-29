const CODE_CACHE: Record<string, string> = {};

export function setVerificationCode(phone: string, code: string) {
  CODE_CACHE[phone] = code;
}

export function getVerificationCode(phone: string): string | undefined {
  return CODE_CACHE[phone];
}

export function deleteVerificationCode(phone: string) {
  delete CODE_CACHE[phone];
}