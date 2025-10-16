import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

async function getWarranty(id: string) {
  return prisma.warranty.findUnique({
    where: { id },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });
}

export default async function WarrantyDetail({ params }: { params: Promise<Record<string, string>> }) {
  const p = await params;
  const id = p.id;
  const warranty = await getWarranty(id);
  if (!warranty) return notFound();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Warranty {warranty.carRegistration}</h1>
        <Link href="/dashboard" className="text-sm underline">Back to dashboard</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-black/10">
          <h2 className="font-medium mb-3">Customer</h2>
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Name:</span> {warranty.customerName}</div>
            <div><span className="font-medium">Email:</span> {warranty.customerEmail}</div>
            <div><span className="font-medium">Phone:</span> {warranty.customerPhone}</div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-black/10">
          <h2 className="font-medium mb-3">Vehicle</h2>
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Make/Model:</span> {warranty.carMake} {warranty.carModel}</div>
            <div><span className="font-medium">Registration:</span> {warranty.carRegistration}</div>
            <div><span className="font-medium">Mileage:</span> {warranty.mileage.toLocaleString()} miles</div>
            <div><span className="font-medium">Purchase Date:</span> {new Date(warranty.purchaseDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <NoteForm warrantyId={warranty.id} />
      <div className="rounded-lg bg-white p-6 shadow-sm border border-black/10">
        <h2 className="font-medium mb-3">Notes</h2>
        <ul className="space-y-3 text-sm">
          {warranty.notes.map((n) => (
            <li key={n.id} className="border border-black/10 rounded p-3">
              <div className="text-black/60 text-xs mb-1">{new Date(n.createdAt).toLocaleString()} • {n.authorName}</div>
              <div>{n.content}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NoteForm({ warrantyId }: { warrantyId: string }) {
  return (
    <form action={`/api/warranties/${warrantyId}/notes`} method="post" className="rounded-lg bg-white p-6 shadow-sm border border-black/10">
      <h2 className="font-medium mb-3">Add Note</h2>
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium">Your Name</label>
          <input name="authorName" required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium">Note</label>
          <input name="content" required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
      </div>
      <div className="mt-4">
        <button className="btn btn-primary">Add Note</button>
      </div>
    </form>
  );
}
