import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-black">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8">
        <div className="space-y-12">
          <header className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/55">
              Menu
            </p>
            <h1 className="text-3xl font-light tracking-[-0.02em] sm:text-4xl">
              Account, plan, and support
            </h1>
          </header>

          <section id="account" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-light tracking-[-0.01em]">Account</h2>
            <div className="rounded-2xl border border-black/10 bg-white/50 p-5">
              <p className="text-[15px] leading-7 text-black/80">
                Signed in with email
              </p>
              <p className="mt-1 text-[15px] leading-7 text-black/55">
                Account details can be expanded as the system develops.
              </p>
            </div>
          </section>

          <section id="plan" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-light tracking-[-0.01em]">Plan</h2>
            <div className="rounded-2xl border border-black/10 bg-white/50 p-5">
              <p className="text-[15px] leading-7 text-black/80">Free plan</p>
              <p className="mt-1 text-[15px] leading-7 text-black/55">
                Extended usage becomes available only when needed.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">Legal</h2>
            <div className="rounded-2xl border border-black/10 bg-white/50 p-2">
              <Link
                href="/privacy"
                className="block rounded-xl px-3 py-3 text-[15px] text-black/80 transition hover:bg-black/5"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="block rounded-xl px-3 py-3 text-[15px] text-black/80 transition hover:bg-black/5"
              >
                Terms
              </Link>
            </div>
          </section>

          <section id="contact" className="space-y-4 scroll-mt-24">
            <h2 className="text-xl font-light tracking-[-0.01em]">Contact</h2>
            <div className="rounded-2xl border border-black/10 bg-white/50 p-5">
              <a
                href="mailto:admin@vireka.space"
                className="text-[15px] leading-7 text-black/80 underline underline-offset-4"
              >
                admin@vireka.space
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
