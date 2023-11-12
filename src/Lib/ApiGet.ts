export async function ApiGet(input: RequestInfo, init?: RequestInit | undefined) {
    const r = await (await fetch(input, init)).json()
    return { body: r.contents, ok: r.status.http_code === 200, status: r.status.http_code }
}