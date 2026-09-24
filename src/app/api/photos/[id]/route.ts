import { isMember } from "@/lib/auth"
import { readPhotoFile } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isMember())) {
    return new Response("Members only.", {
      status: 401,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }
  const { id } = await context.params
  const file = await readPhotoFile(id)
  if (!file) {
    return new Response("Not found.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }
  return new Response(file.bytes, {
    headers: {
      "content-type": file.mime,
      "cache-control": "private, no-store",
    },
  })
}
