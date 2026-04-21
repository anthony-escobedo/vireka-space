"use client";

import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
  staticEmailStyle,
} from "../../../components/StaticPageShell";
import { useLanguage } from "../../../lib/i18n/useLanguage";

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <StaticPageShell
      title={t.contact.pageTitle}
      intro={t.contact.pageIntro}
    >
      <section style={{ ...staticCardStyle, marginBottom: "1rem" }}>
        <a href="mailto:admin@vireka.space" style={staticEmailStyle}>
          admin@vireka.space
        </a>
      </section>

      <section style={staticCardStyle}>
        <p style={staticBodyStyle}>
          {t.contact.feedbackHelpsImprove}
          <br />
          <br />
          {t.contact.messagesReviewed}
        </p>
      </section>
    </StaticPageShell>
  );
}
