"use client";
 
import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
} from "../../../components/StaticPageShell";
import { useLanguage } from "../../../lib/i18n/useLanguage";
 
export default function PlanPage() {
  const { t } = useLanguage();
  return (
    <StaticPageShell
      title={t.plan.pageTitle}
      intro={t.plan.pageIntro}
    >
      <section style={staticCardStyle}>
        <p style={staticBodyStyle}>
          {t.plan.freeAccessIncludes}
          <br />
          <br />
          {t.plan.dailyLimitReached}
          <br />
          <br />
          {t.plan.extendedAccessSubscription}
          {' '}
          {t.plan.subscriptionEnablesAdditional}
          <br />
          <br />
          {t.plan.planStructureMayEvolve}
        </p>
      </section>
    </StaticPageShell>
  );
}