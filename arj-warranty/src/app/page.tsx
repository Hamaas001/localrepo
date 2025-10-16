import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm border border-black/10">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to ARJ MOTORS Warranty Admin</h1>
        <p className="text-black/60 mt-2">Register customer warranties, track notes, and send notifications.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/warranties/new" className="btn btn-primary">Add Warranty</Link>
          <Link href="/dashboard" className="btn border border-black/10">View Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
