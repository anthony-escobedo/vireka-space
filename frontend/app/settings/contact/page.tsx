import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
  staticEmailStyle,
} from "../../../components/StaticPageShell";

export default function ContactPage() {
  return (
    <StaticPageShell
      pill="CONTACT"
      title="Contact and feedback"
      intro="Questions, feedback, and technical issues may be directed using the contact information below."
    >
      <section style={{ ...staticCardStyle, marginBottom: "1rem" }}>
        <a href="mailto:admin@vireka.space" style={staticEmailStyle}>
          admin@vireka.space
        </a>
      </section>

      <section style={staticCardStyle}>
        <p style={staticBodyStyle}>
          Feedback helps improve clarity, reliability, and usability over time.
          <br />
          <br />
          Messages are reviewed as availability allows.
        </p>
      </section>
    </StaticPageShell>
  );
}
