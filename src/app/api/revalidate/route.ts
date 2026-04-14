import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.PIPELINE_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const paths: string[] = body.paths ?? ["/", "/case-studies"];

    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: paths });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
