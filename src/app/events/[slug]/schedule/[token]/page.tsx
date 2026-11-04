import { notFound } from "next/navigation";

import TextToBook from "components/text-to-book";
import { getEventRequestByToken } from "lib/event-requests";
import { getEventBySlug } from "lib/events";
import { eventBookingMessage } from "lib/text-to-book";

export const dynamic = "force-dynamic";

export default async function EventSchedulingPage(
  props: {
    params: Promise<{ slug: string; token: string }>;
  }
) {
  const params = await props.params;
  const event = getEventBySlug(params.slug);
  if (!event) return notFound();

  const eventRequest = await getEventRequestByToken(params.token);
  if (!eventRequest || eventRequest.eventSlug !== event.slug) return notFound();


  return (
    <div className="max-w-5xl mx-auto py-12">
      <p className="text-sm uppercase tracking-[0.18em] text-base-content/60 mb-2">{event.schedule.eyebrow}</p>
      <h1 className="text-4xl font-semibold mb-4">{event.schedule.heading}</h1>
      <p className="text-base-content/70 mb-8">{event.schedule.body}</p>

      <TextToBook
        heading="Set up your planning call"
        intro="The Text button opens Messages with your request filled in."
        message={eventBookingMessage(eventRequest, event.title)}
        location="event_booking"
      />
    </div>
  );
}
