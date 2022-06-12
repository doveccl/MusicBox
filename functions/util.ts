let body: Record<string, string> = {}

export async function hash(s = '') {
  const buf = await crypto.subtle.digest('sha-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map(u => u.toString(16).padStart(2, '0')).join('')
}

export async function get(ctx: IContext, key: string) {
  try {
    const { url, headers } = ctx.request
    const search = new URL(url).searchParams
    if (search.has(key)) return search.get(key)
    if (headers.has(key)) return headers.get(key)
    if (ctx.request.bodyUsed) return body[key]
    return (body = await ctx.request.json())[key]
  } catch {
    return null
  }
}

export function json(obj: unknown) {
  return new Response(JSON.stringify(obj), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
