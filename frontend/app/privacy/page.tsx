"use client";

import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
  staticSectionTitleStyle,
  staticSectionWrapperStyle,
} from "../../components/StaticPageShell";
import { useLanguage } from '../../lib/i18n/useLanguage';

export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <StaticPageShell
      title={t.privacy.heroTitle}
      intro={t.privacy.subtitle}
    >
      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.introduction.title}</h2>
          {t.privacy.sections.introduction.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.informationProvided.title}</h2>
          {t.privacy.sections.informationProvided.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.technicalInformation.title}</h2>
          {t.privacy.sections.technicalInformation.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.dataUsage.title}</h2>
          {t.privacy.sections.dataUsage.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.aiProcessing.title}</h2>
          {t.privacy.sections.aiProcessing.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.thirdPartyServices.title}</h2>
          {t.privacy.sections.thirdPartyServices.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>{t.privacy.sections.userControlUpdates.title}</h2>
          {t.privacy.sections.userControlUpdates.content.map((paragraph, index) => (
            <p key={index} style={staticBodyStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </StaticPageShell>
  );
}
