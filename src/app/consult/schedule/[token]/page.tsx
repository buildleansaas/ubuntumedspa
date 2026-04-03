import { notFound } from "next/navigation";

import CalInlineEmbed from "components/cal-inline-embed";
import { getCalLinks } from "lib/cal";
import { getConsultRequestByToken } from "lib/consults";

export const dynamic = "force-dynamic";

export default async function ConsultSchedulingPage({ params: { token } }: { params: { token: string } }) {
  const consultRequest = await getConsultRequestByToken(token);
  if (!consultRequest) return notFound();

  const { consult } = getCalLinks();

  return (
    <div className="max-w-5xl mx-auto py-12">
      <p className="text-sm uppercase tracking-[0.18em] text-base-content/60 mb-2">Consultation Scheduling</p>
      <h1 className="text-4xl font-semibold mb-4">Choose your consultation time</h1>
      <p className="text-base-content/70 mb-8">
        Your intake form has been recorded. Pick the time that works best and we’ll connect it back to your account.
      </p>

      {consult ? (
        <CalInlineEmbed
          calLink={consult}
          namespace={`consult-${consultRequest.consultRequestId}`}
          name={consultRequest.name}
          email={consultRequest.email}
          phone={consultRequest.phone}
          metadata={{
            accountId: consultRequest.accountId,
            consultRequestId: consultRequest.consultRequestId,
            source: "consult_form",
            interests: consultRequest.interests.join(","),
          }}
        />
      ) : (
        <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
          <h2 className="text-2xl font-semibold mb-3">Scheduling isn’t configured yet</h2>
          <p className="text-base-content/70">Add `NEXT_PUBLIC_CAL_COM_CONSULT_LINK` to enable the consult scheduler.</p>
        </div>
      )}
    </div>
  );
}
