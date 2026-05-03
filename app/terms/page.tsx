import Link from "next/link";

export const metadata = { title: "Terms of Service · Do Güd" };

export default function TermsPage() {
  return (
    <article className="prose-doc space-y-6 pt-2">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-400)]">
          Legal
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[color:var(--color-ink-900)] sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-ink-500)]">
          Last updated: 2026-05-02
        </p>
      </header>

      <Section title="1. Who we are">
        Do Güd (&ldquo;Do Güd,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is a
        reflection platform that lets people ask the people who know them
        specific questions and receive honest, written reflections. By using
        Do Güd, you agree to these Terms.
      </Section>

      <Section title="2. Eligibility">
        You must be 13 years of age or older to create an account. If you are
        under 18, you must have a parent or guardian&apos;s permission. If
        you&apos;re using Do Güd on behalf of an organization, you confirm you
        have the authority to bind that organization to these Terms.
      </Section>

      <Section title="3. Your account">
        You&apos;re responsible for keeping your password safe and for all
        activity on your account. We may suspend or terminate accounts that
        violate these Terms or that put other users at risk.
      </Section>

      <Section title="4. What you can&apos;t post">
        Do Güd is built around honest, kind reflection. The following are
        prohibited:
        <ul className="ml-5 mt-2 list-disc space-y-1 text-[color:var(--color-ink-500)]">
          <li>Hate speech, slurs, or content targeting people based on identity</li>
          <li>Harassment, threats, doxxing, or content meant to demean someone</li>
          <li>Sexual content, explicit imagery, or anything sexualizing minors</li>
          <li>Spam, scams, malware, advertising, or unsolicited promotion</li>
          <li>Impersonation, fraud, or pretending to be someone you&apos;re not</li>
          <li>Content that violates someone&apos;s privacy or copyright</li>
          <li>Encouragement of self-harm or violence</li>
        </ul>
        We may remove content and suspend accounts that violate these rules,
        without notice.
      </Section>

      <Section title="5. Your content">
        You keep ownership of what you post. By posting on Do Güd, you give us
        a worldwide, non-exclusive, royalty-free license to host, display, and
        deliver your content as part of operating the service. When you delete
        your content or your account, we&apos;ll remove that content from
        public areas of the service within a reasonable time, though copies
        may remain in backups for a limited period.
      </Section>

      <Section title="6. Reflections you receive">
        Reflections sent to you are visible to you and (when you choose to pin
        them) on your profile. Do not share private reflections you receive in
        ways that would violate the sender&apos;s expectations of privacy.
      </Section>

      <Section title="7. Reporting and moderation">
        Every reflection has a Report option. Use it. We review reports and
        will act, but we can&apos;t guarantee specific outcomes or response
        times. We are not the arbiters of whether a reflection is true — we
        moderate against the prohibited content list above.
      </Section>

      <Section title="8. The service is provided as-is">
        Do Güd is provided on an &ldquo;as is&rdquo; basis without warranties
        of any kind. We don&apos;t guarantee uptime, that the service is free
        of bugs, or that it will meet your expectations. To the maximum extent
        permitted by law, we are not liable for any indirect, incidental, or
        consequential damages arising from your use of Do Güd.
      </Section>

      <Section title="9. Changes">
        We may update these Terms over time. If we make material changes,
        we&apos;ll do our best to let you know in advance. Continued use of Do
        Güd after a change means you accept the updated Terms.
      </Section>

      <Section title="10. Contact">
        Questions, concerns, or requests:{" "}
        <a
          href="mailto:hello@dogud.app"
          className="underline hover:text-[color:var(--color-sage-700)]"
        >
          hello@dogud.app
        </a>
        .
      </Section>

      <p className="pt-4 text-sm text-[color:var(--color-ink-400)]">
        See also our{" "}
        <Link
          href="/privacy"
          className="underline hover:text-[color:var(--color-sage-700)]"
        >
          Privacy Policy
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
