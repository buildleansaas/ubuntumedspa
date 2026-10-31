import { officialProfiles } from "data/official-profiles";

export default function FooterSocialLinks() {
  if (!officialProfiles.length) return null;

  return (
    <nav className="mt-5" aria-label="Official social profiles">
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {officialProfiles.map((profile) => (
          <li key={profile.href}>
            <a
              className="text-base-content/80 underline decoration-base-300 underline-offset-4 hover:text-base-content hover:decoration-base-content"
              href={profile.href}
              rel="noopener noreferrer"
            >
              {profile.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
