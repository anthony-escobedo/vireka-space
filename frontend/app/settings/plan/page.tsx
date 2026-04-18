import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
} from "@/components/StaticPageShell";

export default function PlanPage() {
  return (
    <StaticPageShell
      pill="PLAN"
      title="Usage structure"
      intro="VIREKA Space is designed to remain accessible while allowing expanded usage when needed."
    >
      <section style={staticCardStyle}>
        <p style={staticBodyStyle}>
          Free access includes up to 20 interactions per day.
          <br />
          <br />
          When the daily limit is reached, usage becomes available again the
          following day.
          <br />
          <br />
          Users who require extended access may choose to subscribe.
          Subscription enables additional usage beyond the daily free limit.
          <br />
          <br />
          Plan structure may evolve as the service develops.
        </p>
      </section>
    </StaticPageShell>
  );
}
