import { notFound } from "next/navigation";

import CalInlineEmbed from "components/cal-inline-embed";
import { getCalLinks } from "lib/cal";
import { getEventRequestByToken } from "lib/event-requests";
import { buildEventMetadataPayload, getEventBySlug } from "lib/events";

export const dynamic = "force-dynamic";

export default async function EventSchedulingPage({
  params,
}: {
  params: { slug: string; token: string };
}) {
  const event = getEventBySlug(params.slug);
  if (!event) return notFound();

  const eventRequest = await getEventRequestByToken(params.token);
  if (!eventRequest || eventRequest.eventSlug !== event.slug) return notFound();

  const { consult } = getCalLinks();

  return (
    <div className="max-w-5xl mx-auto py-12">
      <p className="text-sm uppercase tracking-[0.18em] text-base-content/60 mb-2">{event.schedule.eyebrow}</p>
      <h1 className="text-4xl font-semibold mb-4">{event.schedule.heading}</h1>
      <p className="text-base-content/70 mb-8">{event.schedule.body}</p>

      {consult ? (
        <CalInlineEmbed
          calLink={consult}
          namespace={`event-${event.slug}-${eventRequest.eventRequestId}`}
          name={eventRequest.name}
          email={eventRequest.email}
          phone={eventRequest.phone}
          metadata={{
            accountId: eventRequest.accountId,
            eventRequestId: eventRequest.eventRequestId,
            eventSlug: event.slug,
            source: `event_form:${event.slug}`,
            ...buildEventMetadataPayload(eventRequest.responses),
          }}
        />
      ) : (
        <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
          <h2 className="text-2xl font-semibold mb-3">{event.schedule.fallbackTitle}</h2>
          <p className="text-base-content/70">{event.schedule.fallbackBody}</p>
        </div>
      )}
    </div>
  );
}
