import Link from "next/link";
import { notFound } from "next/navigation";

import ClearCartOnMount from "components/clear-cart-on-mount";
import TextToBook from "components/text-to-book";
import { Button } from "components/ui/button";
import { creditAmountCentsForItem } from "lib/cart-pricing";
import { formatUsd, formatUsdShort } from "lib/price";
import { sendPaidOrderNotifications } from "lib/order-notifications";
import { getOrderByPublicToken, syncOrderFromStripeSession } from "lib/orders";
import { getGiftCardsForOrder, isGiftCardItem } from "lib/gift-cards";
import { orderBookingMessage } from "lib/text-to-book";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage(
  props: {
    searchParams: Promise<{ order?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const orderToken = searchParams.order;
  if (!orderToken) return notFound();

  const storedOrder = await getOrderByPublicToken(orderToken);
  if (!storedOrder) return notFound();

  // Don't wait on the Stripe webhook: ask Stripe directly so the buyer can book right away.
  // Only the session stored on the order is used, never one from the URL.
  let order = storedOrder;
  // A paid gift card order whose cards aren't issued yet goes through the full sync (amount check, issue, then emails).
  const giftCardsPending = Boolean(storedOrder.giftCardUnits && !storedOrder.giftCardsIssuedAt);
  if ((storedOrder.paymentStatus !== "paid" || giftCardsPending) && storedOrder.stripeSessionId) {
    try {
      order = (await syncOrderFromStripeSession(storedOrder.stripeSessionId)) || storedOrder;
    } catch (error) {
      console.error("[checkout/success] order sync failed", storedOrder.orderId, error);
    }
  } else if (storedOrder.paymentStatus === "paid") {
    // Catches orders paid before email was configured, or whose emails failed. No-op once sent.
    try {
      await sendPaidOrderNotifications(storedOrder.orderId);
    } catch (error) {
      console.error("[checkout/success] order emails failed", storedOrder.orderId, error);
    }
  }

  const canSchedule = order.paymentStatus === "paid" && order.requiresScheduling;
  const giftCards =
    order.paymentStatus === "paid" && order.giftCardUnits && order.giftCardsIssuedAt
      ? (await getGiftCardsForOrder(order.orderId)).filter((card) => card.status === "active")
      : [];
  const showPickup = order.items.some((item) => item.fulfillment === "pickup") ||
    (!order.requiresScheduling && !order.items.every(isGiftCardItem));

  return (
    <div className="max-w-5xl mx-auto py-12">
      {order.paymentStatus === "paid" && <ClearCartOnMount />}
      <h1 className="text-4xl font-semibold mb-4">
        {order.paymentStatus === "paid" ? "Payment received" : "We’re processing your order"}
      </h1>
      <p className="text-base-content/70 mb-8">
        {order.paymentStatus === "paid"
          ? "Your order is recorded. If you purchased a procedure, text or call Jenny below to book your appointment."
          : "Stripe has not marked this order as paid yet. Refresh shortly or check your email confirmation."}
      </p>

      <div className="rounded-xl border border-base-300 bg-base-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p className="font-semibold">{formatUsd(order.subtotalCents)}</p>
        </div>
        <div className="space-y-3 mt-4">
          {order.items.map((item) => (
            <div key={item.slug} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-base-content/80">
                  {item.quantity} x {formatUsd(item.unitAmountCents)}
                  {item.pricingMode === "increment_credit"
                    ? ` · ${formatUsdShort(creditAmountCentsForItem(item))} treatment credit`
                    : null}
                </p>
              </div>
              <p>{formatUsd(item.lineTotalCents)}</p>
            </div>
          ))}
        </div>
      </div>

      {canSchedule && (
        <TextToBook
          heading="Book your appointment"
          intro="Text or call Jenny to pick your time. The Text button opens Messages with your order details filled in. If the order has more than one procedure, it is one combined visit."
          message={orderBookingMessage(order)}
          location="order_booking"
        />
      )}

      {order.paymentStatus === "paid" && order.giftCardUnits ? (
        <div className="mb-8 rounded-xl border border-base-300 bg-base-200 p-6" data-gift-cards>
          <h2 className="text-2xl font-semibold mb-3">Your gift card{order.giftCardUnits > 1 ? "s" : ""}</h2>
          {giftCards.length ? (
            <>
              <p className="text-base-content/70 mb-4">
                Open a card to print it or send it on.{order.customerReceiptStatus === "sent" ? " We also emailed the links." : ""} The
                card shows its code, so share it only with the person it&apos;s for.
              </p>
              <ul className="space-y-2">
                {giftCards.map((card) => (
                  <li key={card.entryKey}>
                    {/* A full page load, so analytics records the card page without its private token (layout.tsx). */}
                    <a href={`/gift-cards/card/${card.viewToken}`} className="link link-primary font-medium">
                      {formatUsdShort(card.faceValueCents)} gift card{card.recipientName ? ` for ${card.recipientName}` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-base-content/70">
              {order.giftCardsVoidedAt
                ? "This order's gift cards are no longer active. Questions? Text Jenny."
                : "Your gift card is being created. Refresh in a moment, or check your email."}
            </p>
          )}
        </div>
      ) : null}

      {showPickup && (
        <div className="rounded-xl border border-base-300 bg-base-200 p-6">
          <h2 className="text-2xl font-semibold mb-3">Pickup Details</h2>
          <p className="text-base-content/70">
            Your product order has been recorded for pickup. We&apos;ll contact you to set a pickup time.
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
