import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  const supplied = request.headers
    .get("authorization")
    ?.replace(/^Bearer /, "");
  if (
    !expected ||
    !supplied ||
    Buffer.byteLength(supplied) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
  )
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  revalidateTag("wordpress", { expire: 0 });
  return Response.json({ revalidated: true });
}
