import StaticPageShell, {
  staticBodyStyle,
  staticCardStyle,
} from "../../../components/StaticPageShell";

export default function AccountPage() {
  return (
    <StaticPageShell
      pill="ACCOUNT"
      title="Account access in VIREKA Space"
      intro="Account access becomes relevant when subscription or ongoing plan management is required."
    >
      <section style={staticCardStyle}>
        <p style={staticBodyStyle}>
          Free usage does not currently require sign-in.
          <br />
          <br />
          An account is only required when subscribing to extended access.
          Sign-in allows subscription status, usage allowances, and access
          continuity to be associated with the same user.
          <br />
          <br />
          Authentication may be completed using a supported sign-in provider or
          email verification.
          <br />
          <br />
          Account functionality may expand as the service develops.
        </p>
      </section>
    </StaticPageShell>
  );
}
