import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  carMake: z.string().min(1),
  carModel: z.string().min(1),
  carRegistration: z.string().min(1),
  mileage: z.number().int().nonnegative(),
  purchaseDate: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parse = schema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = parse.data;
  const created = await prisma.warranty.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      carMake: data.carMake,
      carModel: data.carModel,
      carRegistration: data.carRegistration.toUpperCase(),
      mileage: data.mileage,
      purchaseDate: new Date(data.purchaseDate),
    },
  });

  // Emails
  const siteName = "ARJ MOTORS";
  const promises: Promise<unknown>[] = [];
  promises.push(
    sendMail({
      to: created.customerEmail,
      subject: `${siteName} Warranty Registration`,
      html: `<p>Hi ${created.customerName},</p><p>Thank you for registering your warranty with ${siteName}.</p>`,
    }).catch(() => null)
  );
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    promises.push(
      sendMail({
        to: adminEmail,
        subject: `New warranty registered: ${created.carRegistration}`,
        html: `<p>New warranty registered for ${created.customerName} (${created.customerEmail}).</p>`,
      }).catch(() => null)
    );
  }
  Promise.all(promises).catch(() => null);

  return NextResponse.json({ id: created.id });
}
