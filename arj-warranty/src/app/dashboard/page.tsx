import prisma from "@/lib/prisma";
import Link from "next/link";

async function getWarranties(q?: string) {
  if (q && q.trim()) {
    const term = q.trim();
    return prisma.warranty.findMany({
      where: {
        OR: [
          { customerName: { contains: term } },
          { customerEmail: { contains: term } },
          { carRegistration: { contains: term } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
  return prisma.warranty.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : Array.isArray(sp.q) ? sp.q[0] : undefined;
  const data = await getWarranties(q);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <form className="flex gap-2">
        <input name="q" defaultValue={q || ""} placeholder="Search name, email, reg" className="rounded-md border px-3 py-2 w-full max-w-md" />
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="overflow-x-auto rounded-lg border border-black/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Reg</th>
              <th className="text-left p-3">Vehicle</th>
              <th className="text-left p-3">Purchased</th>
            </tr>
          </thead>
          <tbody>
            {data.map((w) => (
              <tr key={w.id} className="border-t border-black/5 hover:bg-black/5">
                <td className="p-3"><Link href={`/warranties/${w.id}`} className="underline underline-offset-2">{w.customerName}</Link></td>
                <td className="p-3">{w.customerEmail}</td>
                <td className="p-3">{w.customerPhone}</td>
                <td className="p-3 font-medium">{w.carRegistration}</td>
                <td className="p-3">{w.carMake} {w.carModel}</td>
                <td className="p-3">{new Date(w.purchaseDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
