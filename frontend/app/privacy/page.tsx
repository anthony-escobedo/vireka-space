import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
  staticSectionTitleStyle,
  staticSectionWrapperStyle,
} from "../../components/StaticPageShell";

export default function PrivacyPage() {
  return (
    <StaticPageShell
      pill="PRIVACY"
      title="How information is handled in VIREKA Space"
      intro="This page explains how information is handled when using the service."
    >
      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>Introduction</h2>
          <p style={staticBodyStyle}>
            This page describes how information is handled when using VIREKA Space.
            <br />
            <br />
            VIREKA Space provides a structured environment for clarifying how
            situations are being understood before decisions are made or AI prompts
            are written. The service processes text provided by users in order to
            generate structured interpretive output.
            <br />
            <br />
            The goal of this policy is to explain what information is involved in
            that process and how it is handled.
          </p>
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>Information provided by users</h2>
          <p style={staticBodyStyle}>
            Users may provide text describing situations, interpretations, or AI
            interactions.
            <br />
            <br />
            This information is processed for the purpose of generating structured
            clarification output.
            <br />
            <br />
            Users should avoid including sensitive personal information unless it
            is necessary for the situation being described.
            <br />
            <br />
            Information is used only to support the functioning of the service.
          </p>
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>Technical information</h2>
          <p style={staticBodyStyle}>
            Basic technical information may be collected to maintain service
            reliability and performance.
            <br />
            <br />
            This may include information such as interaction timing, system logs,
            or usage counts necessary to operate and improve the service.
            <br />
            <br />
            This information is used in aggregated form where possible.
          </p>
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>How information is used</h2>
          <p style={staticBodyStyle}>
            Information provided through the service is used to generate structured
            interpretive responses, maintain system functionality, improve clarity
            and reliability, and understand general patterns of usage.
            <br />
            <br />
            Information is not sold to third parties.
          </p>
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>AI processing</h2>
          <p style={staticBodyStyle}>
            User input may be processed by AI systems in order to produce
            structured output.
            <br />
            <br />
            Processing is performed solely for the purpose of providing the
            VIREKA Space service.
            <br />
            <br />
            Inputs are not treated as public content.
          </p>
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>Data storage and third-party services</h2>
          <p style={staticBodyStyle}>
            Information may be stored as required to operate the service, maintain
            stability, and improve performance.
            <br />
            <br />
            Storage practices may evolve as the system develops.
            <br />
            <br />
            VIREKA Space may rely on infrastructure and processing providers in
            order to operate. These providers may process information as necessary
            to support system functionality.
          </p>
        </div>
      </section>

      <section style={staticSectionWrapperStyle}>
        <div style={staticCardStyle}>
          <h2 style={staticSectionTitleStyle}>User control and updates</h2>
          <p style={staticBodyStyle}>
            Users control what information they choose to provide and may avoid
            including identifying details where not necessary.
            <br />
            <br />
            Use of the service is voluntary, and users may discontinue use at any
            time.
            <br />
            <br />
            This Privacy Policy may be updated periodically to reflect improvements
            or changes to the service.
          </p>
        </div>
      </section>
    </StaticPageShell>
  );
}
