export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-black">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8">
        <div className="space-y-12">
          <header className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/55">
              Privacy
            </p>
            <h1 className="text-3xl font-light tracking-[-0.02em] sm:text-4xl">
              How information is handled in VIREKA Space
            </h1>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              Introduction
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              This page describes how information is handled when using VIREKA
              Space.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              VIREKA Space provides a structured environment for clarifying how
              situations are being understood before decisions are made or AI
              prompts are written. The service processes text provided by users
              in order to generate structured interpretive output.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              The goal of this policy is to explain what information is involved
              in that process and how it is handled.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              Information provided by users
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              Users may provide text describing situations, interpretations, or
              AI interactions.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              This information is processed for the purpose of generating
              structured clarification output.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Users should avoid including sensitive personal information unless
              it is necessary for the situation being described.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Information is used only to support the functioning of the
              service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              Technical information
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              Basic technical information may be collected to maintain service
              reliability and performance.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              This may include information such as interaction timing, system
              logs, or usage counts necessary to operate and improve the
              service.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              This information is used in aggregated form where possible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              How information is used
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              Information provided through the service is used to:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-black/80">
              <li>generate structured interpretive responses</li>
              <li>maintain system functionality</li>
              <li>improve clarity and reliability of the service</li>
              <li>understand general patterns of usage</li>
            </ul>
            <p className="text-[15px] leading-7 text-black/80">
              Information is not sold to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              AI processing
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              User input may be processed by AI systems in order to produce
              structured output.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Processing is performed solely for the purpose of providing the
              VIREKA Space service.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Inputs are not treated as public content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              Data storage
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              Information may be stored as required to operate the service,
              maintain stability, and improve performance.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Storage practices may evolve as the system develops.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Reasonable efforts are made to handle information responsibly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              Third-party services
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              VIREKA Space may rely on infrastructure and processing providers
              in order to operate.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              These providers may process information as necessary to support
              system functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              User control
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              Users control what information they choose to provide.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Users may avoid including identifying details where not necessary.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Use of the service is voluntary, and users may discontinue use at
              any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">
              Changes to this policy
            </h2>
            <p className="text-[15px] leading-7 text-black/80">
              This Privacy Policy may be updated periodically to reflect
              improvements or changes to the service.
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              Continued use of the service after updates indicates acceptance of
              the revised policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-light tracking-[-0.01em]">Contact</h2>
            <p className="text-[15px] leading-7 text-black/80">
              For questions regarding this policy:
            </p>
            <p className="text-[15px] leading-7 text-black/80">
              admin@vireka.space
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
