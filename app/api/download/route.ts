import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { s3Client, BUCKET_NAME } from "@/lib/s3";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = req.nextUrl.searchParams.get("key");
  if (!key || !key.startsWith(`expenses/${session.user.id}/`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  const response = await s3Client.send(command);

  const fileName = key.split("/").pop() ?? "photo.jpg";

  return new NextResponse(response.Body as ReadableStream, {
    headers: {
      "Content-Type": response.ContentType ?? "image/jpeg",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
