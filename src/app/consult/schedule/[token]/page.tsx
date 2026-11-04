import { notFound } from "next/navigation";

import TextToBook from "components/text-to-book";
import { getConsultRequestByToken } from "lib/consults";
import { consultBookingMessage } from "lib/text-to-book";

export const dynamic = "force-dynamic";

export default async function ConsultSchedulingPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;

  const consultRequest = await getConsultRequestByToken(token);
  if (!consultRequest) return notFound();

  return (
    <div className="max-w-5xl mx-auto py-12">
      <p className="text-sm uppercase tracking-[0.18em] text-base-content/60 mb-2">Consultation Scheduling</p>
      <h1 className="text-4xl font-semibold mb-4">Text Jenny to pick your consultation time</h1>
      <p className="text-base-content/70 mb-8">Your intake form has been recorded. Text or call Jenny and she will confirm a time.</p>

      <TextToBook
        heading="Book your consultation"
        intro="The Text button opens Messages with your request filled in."
        message={consultBookingMessage(consultRequest)}
        location="consult_booking"
      />
    </div>
  );
}
