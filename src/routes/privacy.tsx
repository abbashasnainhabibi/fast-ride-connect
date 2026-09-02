import { pageMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy Policy — FAST Carpool", "How FAST Carpool handles university email verification, timetable data, approximate pickup areas and phone numbers.", "What we collect, what stays private, and how carpool matching data is used."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: August 2026. This prototype stores data locally in your browser only.
        </p>

        <div className="surface prose-legal mt-8 p-6 sm:p-8">
          <h2>1. Who this service is for</h2>
          <p>
            FAST Carpool is a student community project for students of FAST NUCES Karachi. It is not an
            official university service and is not operated or endorsed by FAST NUCES.
          </p>

          <h2>2. University email verification</h2>
          <p>
            An account can only be created with a FAST university email address (for example
            <span> k214512@nu.edu.pk</span>). We send a 6-digit verification code to that address to confirm
            you are a student. Your email address is used for verification and account recovery only; it is
            never shown to other students and never shared with third parties or used for marketing.
          </p>

          <h2>3. Timetable data</h2>
          <p>
            When you upload a timetable, we extract only the <strong>days and time slots</strong> of your
            classes. Course titles, section codes, teacher names, room numbers and grades are not stored and
            are never displayed to other students. Other students can only see the overlap between your free
            or travel windows and theirs — the raw timetable file is never shared.
          </p>

          <h2>4. Location and pickup areas</h2>
          <p>
            We deliberately do not collect home addresses, GPS coordinates or live location. You choose an
            <strong> approximate area or public landmark</strong> near you (for example "Gulshan-e-Iqbal
            Block 6" or "Millennium Mall"). This approximate area is the only location information other
            students can see, and it is used purely to estimate route compatibility.
          </p>

          <h2>5. Phone numbers and contact details</h2>
          <p>
            Your phone number is hidden by default. It becomes visible to another student only after a
            carpool request has been explicitly accepted by both sides. If you remove a connection, contact
            details are hidden again. You may leave your phone number blank and arrange contact another way.
          </p>

          <h2>6. What other students can see</h2>
          <ul>
            <li>Your name, gender (if you choose to share it) and verified-student badge.</li>
            <li>Your approximate pickup area and ride type (driver, passenger or either).</li>
            <li>Shared travel days and matching time windows.</li>
            <li>Your phone number — only after a connection is accepted.</li>
          </ul>

          <h2>7. Moderation</h2>
          <p>
            Reports submitted about a student are reviewed by moderators. Moderators can see the reported
            profile, the report reason and account status, so that unsafe behaviour can be acted on. Reports
            are confidential and the reporter's identity is not disclosed to the reported student.
          </p>

          <h2>8. Data retention and deletion</h2>
          <p>
            In this prototype, all data lives in your own browser storage and is removed when you clear it.
            In a production deployment, you would be able to delete your account at any time, which removes
            your profile, timetable timings, connections and contact details.
          </p>

          <h2>9. Contact</h2>
          <p>
            For privacy questions or to request removal of your data, contact the moderation team through the
            in-app report option.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
