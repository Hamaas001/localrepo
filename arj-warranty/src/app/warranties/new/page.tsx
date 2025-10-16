"use client";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  carMake: z.string().min(1),
  carModel: z.string().min(1),
  carRegistration: z.string().min(1),
  mileage: z.coerce.number().int().nonnegative(),
  purchaseDate: z.string().min(1),
});

export default function NewWarrantyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const parse = schema.safeParse(values);
    if (!parse.success) {
      setSubmitting(false);
      setError("Please fill all required fields correctly.");
      return;
    }

    const res = await fetch("/api/warranties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parse.data),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(json.error || "Failed to create warranty");
      return;
    }
    router.push(`/warranties/${json.id}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Register Warranty</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-sm border border-black/10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium">Customer Name</label>
            <input name="customerName" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Customer Email</label>
            <input type="email" name="customerEmail" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Customer Phone</label>
            <input name="customerPhone" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Make</label>
            <input name="carMake" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Model</label>
            <input name="carModel" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Registration</label>
            <input name="carRegistration" required className="mt-1 w-full rounded-md border px-3 py-2 uppercase" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mileage</label>
            <input type="number" name="mileage" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Purchase Date</label>
            <input type="date" name="purchaseDate" required className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Warranty"}
          </button>
        </div>
      </form>
    </div>
  );
}
