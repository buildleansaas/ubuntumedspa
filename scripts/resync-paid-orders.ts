import "dotenv/config";

import { syncOrderFromStripeSession } from "../src/lib/orders";
import { getStripe } from "../src/lib/stripe";

// Re-syncs paid Stripe checkouts into Mongo, for orders the webhook missed.
// Emails go out only with --notify; without it, orders are just marked paid.
const notify = process.argv.includes("--notify");
const sinceArg = process.argv.find((arg) => arg.startsWith("--since="));
const since = sinceArg ? Math.floor(new Date(sinceArg.slice("--since=".length)).getTime() / 1000) : undefined;

const main = async () => {
  const stripe = getStripe();
  let synced = 0;

  for await (const session of stripe.checkout.sessions.list({
    limit: 100,
    status: "complete",
    ...(since ? { created: { gte: since } } : {}),
  })) {
    if (session.payment_status !== "paid" || !session.metadata?.orderId) continue;

    const order = await syncOrderFromStripeSession(session.id, { notify });
    synced += 1;
    console.log(
      `${new Date(session.created * 1000).toISOString().slice(0, 10)} ${session.id.slice(-10)} -> ${
        order?.paymentStatus ?? "missing"
      }`
    );
  }

  console.log(`Synced ${synced} paid orders${notify ? " (emails on)" : " (emails off)"}.`);
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
