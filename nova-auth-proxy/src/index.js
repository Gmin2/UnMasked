export default {
  async fetch(request) {
    const ALLOWED_ORIGIN = 'https://mintug.near.page'

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    const url = new URL(request.url)
    const targetUrl = `https://nova-sdk.com${url.pathname}`

    // Read body as text to ensure it's forwarded correctly
    const body = await request.text()

    // Forward all original headers
    const headers = new Headers()
    for (const [key, value] of request.headers.entries()) {
      // Skip host and CF-specific headers
      if (key === 'host' || key.startsWith('cf-') || key === 'x-forwarded') continue
      headers.set(key, value)
    }
    headers.set('Host', 'nova-sdk.com')

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
    })

    // Read response body
    const responseBody = await response.text()

    return new Response(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': '*',
      },
    })
  },
}
