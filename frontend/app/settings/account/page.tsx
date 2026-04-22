"use client";

import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
} from "../../../components/StaticPageShell";
import { useLanguage } from "../../../lib/i18n/useLanguage";

export default function AccountPage() {
  const { t } = useLanguage();
  return (
    <StaticPageShell
      title={t.account.pageTitle}
      intro={t.account.pageIntro}
    >
      <section style={staticCardStyle}>
        <p style={staticBodyStyle}>
          {t.account.freeUsageNoSignIn}
          <br />
          <br />
          {t.account.accountRequiredForSubscription}
          {' '}
          {t.account.signInAllowsSubscription}
          <br />
          <br />
          {t.account.authenticationMethods}
        </p>
      </section>
    </StaticPageShell>
  );
}
