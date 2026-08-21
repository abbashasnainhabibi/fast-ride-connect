import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — FAST Carpool" },
      {
        name: "description",
        content:
          "The rules for using FAST Carpool: eligibility, respectful conduct, safety expectations and account moderation.",
      },
      { property: "og:title", content: "Terms of Use — FAST Carpool" },
      {
        property: "og:description",
        content: "Eligibility, conduct, safety and moderation rules for FAST Carpool members.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: August 2026.</p>

        <div className="surface prose-legal mt-8 p-6 sm:p-8">
          <h2>1. Eligibility</h2>
          <p>
            You may use FAST Carpool only if you are a currently enrolled FAST NUCES student with a valid
            university email address. Accounts created with non-university emails will be removed.
          </p>

          <h2>2. Accurate information</h2>
          <p>
            You agree to provide accurate details: your real name, a timetable that belongs to you, and a
            pickup area you actually travel from. Impersonating another student is grounds for a permanent
            ban.
          </p>

          <h2>3. Nature of the service</h2>
          <p>
            FAST Carpool is an introduction tool only. We do not provide transport, do not verify driving
            licences or vehicle insurance, and are not a party to any arrangement you make. Cost sharing,
            timings and pick-up points are agreed directly between students.
          </p>

          <h2>4. Safety expectations</h2>
          <ul>
            <li>Meet at public, well-lit landmarks — never share your home address.</li>
            <li>Tell a friend or family member about your carpool arrangement.</li>
            <li>Respect stated gender and ride-type preferences.</li>
            <li>Do not carpool with anyone you feel unsafe with; end the connection and report instead.</li>
          </ul>

          <h2>5. Respectful conduct</h2>
          <p>
            Harassment, discrimination, unwanted contact, spam and sharing another student's contact details
            without consent are prohibited. Contact information unlocked through a connection may be used
            only to arrange the carpool.
          </p>

          <h2>6. Moderation and enforcement</h2>
          <p>
            Moderators may suspend or ban accounts that breach these terms, with or without prior warning
            depending on severity. Suspended accounts lose access to matching and connections. Moderation
            actions are recorded in an internal activity log.
          </p>

          <h2>7. Prototype status</h2>
          <p>
            This build is a frontend prototype. Data is stored in your browser, features may change, and no
            guarantee of availability or data preservation is made.
          </p>

          <h2>8. Changes to these terms</h2>
          <p>
            We may update these terms as the service develops. Continued use after an update means you accept
            the revised terms.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
