// Test stand-in for next/headers: cookies() serves whatever setRequestCookies() was given.
let jar = {};

export function setRequestCookies(values = {}) {
  jar = { ...values };
}

export async function cookies() {
  return { get: (name) => (name in jar ? { name, value: jar[name] } : undefined) };
}
