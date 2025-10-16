"use client";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-lg bg-white p-6 shadow-sm border border-black/10">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}
