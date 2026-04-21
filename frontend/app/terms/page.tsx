"use client";

import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
  staticSectionTitleStyle,
  staticSectionWrapperStyle,
} from "../../components/StaticPageShell";
import { useLanguage } from '../../lib/i18n/useLanguage';

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <StaticPageShell
      title={t.terms.heroTitle}
      intro={t.terms.subtitle}
    >
      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.introduction.title}</h2>
          {t.terms.sections.introduction.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.useOfService.title}</h2>
          {t.terms.sections.useOfService.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.natureOfService.title}</h2>
          {t.terms.sections.natureOfService.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.userResponsibility.title}</h2>
          {t.terms.sections.userResponsibility.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.availabilityChanges.title}</h2>
          {t.terms.sections.availabilityChanges.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.limitationOfLiability.title}</h2>
          {t.terms.sections.limitationOfLiability.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.terms.sections.updatesToTerms.title}</h2>
          {t.terms.sections.updatesToTerms.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </StaticPageShell>
  );
}
