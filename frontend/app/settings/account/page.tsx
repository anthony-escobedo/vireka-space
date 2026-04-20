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
      pill={t.settings.account}
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
          <br />
          <br />
          {t.account.functionalityMayExpand}
        </p>
      </section>
    </StaticPageShell>
  );
}
