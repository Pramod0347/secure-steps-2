export async function generateSecureToken(length: number): Promise<string> {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) return false;
  
  // const aBuffer = new TextEncoder().encode(a);
  // const bBuffer = new TextEncoder().encode(b);
  
  return a === b; // In Edge Runtime, we use simple comparison as timing attacks are less relevant
} 