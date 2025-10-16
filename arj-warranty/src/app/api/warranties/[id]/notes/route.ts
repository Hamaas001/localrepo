import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendMail } from "@/lib/mailer";

const schema = z.object({ authorName: z.string().min(1), content: z.string().min(1) });

export async function POST(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const idx = segments.indexOf("warranties");
  const id = idx !== -1 && segments[idx + 1] ? segments[idx + 1] : null;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const parse = schema.safeParse(data);
  if (!parse.success) return NextResponse.redirect(`/warranties/${id}?err=invalid`, { status: 302 });

  const warranty = await prisma.warranty.findUnique({ where: { id } });
  if (!warranty) return NextResponse.redirect(`/dashboard?err=missing`, { status: 302 });

  await prisma.note.create({
    data: { warrantyId: id, authorName: parse.data.authorName, content: parse.data.content },
  });

  // Notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `Warranty note updated: ${warranty.carRegistration}`,
      html: `<p>${parse.data.authorName} added a note:</p><p>${parse.data.content}</p>`,
    }).catch(() => null);
  }

  return NextResponse.redirect(`/warranties/${id}`, { status: 302 });
}
