import Link from "next/link";

export const metadata = { title: "Privacy Policy · Do Güd" };

export default function PrivacyPage() {
  return (
    <article className="space-y-6 pt-2">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[color:var(--color-ink-900)] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
          Last updated: 2026-05-02
        </p>
      </header>

      <Section title="What we collect">
        <ul className="ml-5 list-disc space-y-1 text-[color:var(--color-ink-500)]">
          <li>
            <b className="text-[color:var(--color-ink-900)]">Account data:</b>{" "}
            email, name, username, avatar, optional bio, hashed password.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Content:</b>{" "}
            prompts you ask, reflections you write or receive, traits you tag,
            pin states.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Guest responses:</b>{" "}
            if someone responds to a prompt without an account, we store the
            first name they enter and (if provided) their email.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Operational:</b>{" "}
            IP addresses (for rate limiting and abuse prevention), basic
            access logs.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Reports:</b>{" "}
            content that&apos;s been reported, the reason, and who filed it.
          </li>
        </ul>
      </Section>

      <Section title="What we don't collect">
        We do not run third-party advertising trackers. We do not sell
        personal data. We do not buy data from data brokers.
      </Section>

      <Section title="How we use it">
        <ul className="ml-5 list-disc space-y-1 text-[color:var(--color-ink-500)]">
          <li>To run the service: deliver your reflections, send drop emails, verify accounts.</li>
          <li>To keep the platform safe: rate limiting, content moderation, banning bad actors.</li>
          <li>To respond to you: customer support, legal requests, security notifications.</li>
        </ul>
      </Section>

      <Section title="Who can see what">
        <ul className="ml-5 list-disc space-y-1 text-[color:var(--color-ink-500)]">
          <li>
            Your <b className="text-[color:var(--color-ink-900)]">prompts</b>{" "}
            are visible on the public feed and on your profile.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Reflections</b>{" "}
            written about you are visible to you. They become visible on your
            profile only when you choose to pin them.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Drop reflections</b>{" "}
            sent to you are visible only to you unless you pin them.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Anonymous</b>{" "}
            responses hide the responder&apos;s identity from the prompt
            author. Admins retain access for moderation.
          </li>
        </ul>
      </Section>

      <Section title="Service providers we use">
        <ul className="ml-5 list-disc space-y-1 text-[color:var(--color-ink-500)]">
          <li>
            <b className="text-[color:var(--color-ink-900)]">Vercel</b> hosts
            the application and runs serverless functions.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Neon</b> hosts our
            Postgres database.
          </li>
          <li>
            <b className="text-[color:var(--color-ink-900)]">Resend</b> (when
            enabled) sends transactional email like account verification and
            drop notifications.
          </li>
        </ul>
        These providers process data on our behalf under their own privacy
        practices.
      </Section>

      <Section title="Your choices">
        <ul className="ml-5 list-disc space-y-1 text-[color:var(--color-ink-500)]">
          <li>You can edit or delete your prompts and reflections at any time from your hub.</li>
          <li>You can request account deletion by emailing hello@dogud.app — we&apos;ll remove your account and content within 30 days.</li>
          <li>You can request a copy of your data in the same way.</li>
        </ul>
      </Section>

      <Section title="Retention">
        We keep account data while your account is active. When you delete
        your account, we remove your content from public areas of the service
        immediately and from our active systems within 30 days. Backups may
        retain copies for up to 60 days.
      </Section>

      <Section title="Minors">
        Do Güd is intended for adults aged 18 and over. We don&apos;t
        knowingly collect information from anyone under 18. If we learn an
        account belongs to someone under 18, we&apos;ll delete it.
      </Section>

      <Section title="Region-specific rights">
        If you&apos;re in the EEA, UK, Switzerland, or California, you have
        rights under GDPR and CCPA respectively, including the right to
        access, correct, delete, or export your data, and to object to or
        restrict processing. Contact hello@dogud.app to exercise any of these.
      </Section>

      <Section title="Changes">
        We&apos;ll update this Policy when our practices change. Material
        changes will be communicated via email or in-app notice.
      </Section>

      <Section title="Contact">
        <a
          href="mailto:hello@dogud.app"
          className="underline hover:text-[color:var(--color-sage-700)]"
        >
          hello@dogud.app
        </a>
      </Section>

      <p className="pt-4 text-sm text-[color:var(--color-ink-400)]">
        See also our{" "}
        <Link
          href="/terms"
          className="underline hover:text-[color:var(--color-sage-700)]"
        >
          Terms of Service
        </Link>
        .
      </p>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl text-[color:var(--color-ink-900)]">
        {title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink-700)]">
        {children}
      </div>
    </section>
  );
}
