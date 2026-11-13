const CLINIC_MAP_QUERY = "Williamsburg Med Spa, 3900 Powhatan Parkway, Williamsburg, VA 23188";

/**
 * Query embed for the clinic name and street address.
 * Replace CLINIC_MAP_EMBED_SRC with the Google Business Profile
 * Share → Embed a map URL when Austin pastes it. Do not invent a place ID.
 */
export const CLINIC_MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(CLINIC_MAP_QUERY)}&z=16&output=embed`;

export default function ClinicMapEmbed({ className = "mt-6 aspect-[16/9] max-w-xl" }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden border border-base-300 bg-base-200 ${className}`}>
      <iframe
        title="Map of Williamsburg Med Spa, 3900 Powhatan Parkway, Williamsburg, VA 23188"
        src={CLINIC_MAP_EMBED_SRC}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
