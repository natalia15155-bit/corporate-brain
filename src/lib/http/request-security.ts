const defaultMaximumBodyBytes = 4_096;

export class HttpRequestError extends Error {
  public readonly status: 400 | 413 | 415;

  constructor(
    message: string,
    status: 400 | 413 | 415,
  ) {
    super(message);
    this.name = "HttpRequestError";
    this.status = status;
  }
}

export function normalizeUntrustedText(
  value: string,
  maximumLength: number,
): string {
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maximumLength);
}

export async function readLimitedJson(
  request: Request,
  maximumBodyBytes = defaultMaximumBodyBytes,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new HttpRequestError(
      "Content-Type must be application/json.",
      415,
    );
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maximumBodyBytes
  ) {
    throw new HttpRequestError("The request body is too large.", 413);
  }

  if (!request.body) {
    throw new HttpRequestError("A JSON request body is required.", 400);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > maximumBodyBytes) {
        await reader.cancel();
        throw new HttpRequestError("The request body is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch {
    throw new HttpRequestError("The request body must be valid JSON.", 400);
  }
}
