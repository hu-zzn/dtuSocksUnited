import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | infoSoc",
  description:
    "How infoSoc collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 15, 2026"

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm text-center mb-12">
        Last updated: {lastUpdated}
      </p>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section className="space-y-3">
          <p>
            infoSoc ("we", "us", or "our") is the central platform connecting
            students with societies and clubs at Delhi Technological University
            (DTU). This Privacy Policy explains what information we collect when
            you use infoSoc, how we use it, and the choices you have. By using
            the platform, you agree to the practices described here.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">
                Account information:
              </span>{" "}
              your name, email address, and any details you provide when you
              register or manage a society profile.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Activity information:
              </span>{" "}
              events you view or register for, societies you follow, and items
              you add to your cart.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Technical information:
              </span>{" "}
              basic device and usage data (such as browser type and pages
              visited) collected automatically to keep the platform secure and
              working well.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and manage your account.</li>
            <li>
              To show you relevant societies, events, and campus activities.
            </li>
            <li>To process event registrations and related requests.</li>
            <li>
              To communicate with you about updates, queries, or important
              notices.
            </li>
            <li>To maintain the security and reliability of the platform.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            How We Share Information
          </h2>
          <p>
            We do not sell your personal information. We may share information
            with society administrators when you register for their events or
            interact with their profiles, and with service providers who help
            us operate the platform. We may also disclose information where
            required by law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Data Security</h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, alteration, or disclosure. However, no method
            of transmission or storage is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Your Choices</h2>
          <p>
            You may access, update, or request deletion of your account
            information at any time by contacting us. You can also choose not to
            provide certain information, though this may limit some features of
            the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will revise the "Last updated" date above. We encourage you to
            review this page periodically.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle
            your information, reach out to us at{" "}
            <a
              href="mailto:infosoc.queries@gmail.com"
              className="text-primary hover:underline"
            >
              infosoc.queries@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
