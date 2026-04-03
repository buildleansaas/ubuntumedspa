import Link from "next/link";
import { notFound } from "next/navigation";

import CalInlineEmbed from "components/cal-inline-embed";
import ClearCartOnMount from "components/clear-cart-on-mount";
import { Button } from "components/ui/button";
import { getCalLinks } from "lib/cal";
import { formatUsd } from "lib/price";
import { getOrderByPublicToken } from "lib/orders";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; session_id?: string };
}) {
  const orderToken = searchParams.order;
  if (!orderToken) return notFound();

  const order = await getOrderByPublicToken(orderToken);
  if (!order) return notFound();

  const { paidProcedure } = getCalLinks();
  const canSchedule = order.paymentStatus === "paid" && order.requiresScheduling && Boolean(paidProcedure);

  return (
    <div className="max-w-5xl mx-auto py-12">
      {order.paymentStatus === "paid" && <ClearCartOnMount />}
      <p className="text-sm uppercase tracking-[0.18em] text-base-content/60 mb-2">Checkout Complete</p>
      <h1 className="text-4xl font-semibold mb-4">
        {order.paymentStatus === "paid" ? "Payment received" : "We’re processing your order"}
      </h1>
      <p className="text-base-content/70 mb-8">
        {order.paymentStatus === "paid"
          ? "Your order is recorded. If you purchased a procedure, book your appointment below."
          : "Stripe has not marked this order as paid yet. Refresh shortly or check your email confirmation."}
      </p>

      <div className="rounded-2xl border border-base-300 bg-base-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p className="font-semibold">{formatUsd(order.subtotalCents)}</p>
        </div>
        <div className="space-y-3 mt-4">
          {order.items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-base-content/60">
                  {item.quantity} x {item.displayPrice}
                </p>
              </div>
              <p>{formatUsd(item.lineTotalCents)}</p>
            </div>
          ))}
        </div>
      </div>

      {canSchedule && (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
          <h2 className="text-2xl font-semibold mb-3">Schedule Your Appointment</h2>
          <p className="text-base-content/70 mb-6">
            Choose one appointment time for this order. If the order contains multiple procedures, the visit will be
            handled as one combined session.
          </p>
          <CalInlineEmbed
            calLink={paidProcedure}
            namespace={`paid-order-${order.orderId}`}
            name={order.customerName}
            email={order.customerEmail}
            phone={order.customerPhone}
            metadata={{
              orderId: order.orderId,
              accountId: order.accountId || "",
              orderToken: order.publicToken,
              source: "stripe_success",
              itemSlugs: order.items.map((item) => item.slug).join(","),
            }}
          />
        </div>
      )}

      {order.requiresScheduling && !paidProcedure && (
        <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
          <h2 className="text-2xl font-semibold mb-3">Scheduling isn’t configured yet</h2>
          <p className="text-base-content/70">Add `NEXT_PUBLIC_CAL_COM_PROCEDURE_LINK` to enable the on-site calendar embed.</p>
        </div>
      )}

      {!order.requiresScheduling && (
        <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
          <h2 className="text-2xl font-semibold mb-3">Pickup Details</h2>
          <p className="text-base-content/70">
            Your product order has been recorded for pickup. If you need to coordinate timing, contact the office or add
            pickup notes during follow-up.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/products">Shop More Products</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/procedures">View More Procedures</Link>
        </Button>
      </div>
    </div>
  );
}
