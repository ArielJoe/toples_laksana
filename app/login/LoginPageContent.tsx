"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon, LockIcon, MailIcon, LoaderCircleIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-text-primary">
      <main className="relative z-10 mx-auto flex w-full max-w-screen-2xl grow items-center justify-center p-6">
        <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full bg-white/70 font-bold uppercase tracking-widest text-text-secondary backdrop-blur-sm hover:text-primary")}
          >
            Beranda
          </Link>
        </div>

        <Card className="w-full max-w-110 overflow-hidden border border-border bg-white/90 py-0 backdrop-blur-2xl transition-all duration-500">
          <div className="px-6 pb-6 pt-10 text-center sm:px-10 sm:pt-12">
            <Link href="/" className="mb-6 inline-block text-2xl font-extrabold tracking-tight text-primary-500">
              Toples Laksana
            </Link>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-text-primary">Login Admin</h1>
          </div>

          <form className="space-y-6 px-6 pb-10 sm:px-10 sm:pb-12" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="px-1" htmlFor="email">
                Email
              </Label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted transition-colors group-focus-within:text-primary-500">
                  <MailIcon className="size-4" />
                </div>
                <Input
                  autoFocus
                  className="h-12 bg-white pl-12 pr-4 font-bold"
                  id="email"
                  name="email"
                  placeholder="admin@topleslaksana.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between px-1">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-muted transition-colors group-focus-within:text-primary-500">
                  <LockIcon className="size-4" />
                </div>
                <Input
                  className="h-12 bg-white pl-12 pr-12 font-bold"
                  id="password"
                  name="password"
                  placeholder="********"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="group h-12 w-full font-bold uppercase tracking-widest"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
