import "dotenv/config";

import { getOrderById, syncOrderFromStripeSession } from "../src/lib/orders";
import { getStripe } from "../src/lib/stripe";

// Re-syncs paid Stripe checkouts created on or after --since into Mongo, for orders the webhook missed.
//   --dry-run  list what would be synced, change nothing
//   --notify   also send any receipt / owner alert not yet sent for those orders
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const notify = args.includes("--notify");
const sinceArg = args.find((arg) => arg.startsWith("--since="))?.slice("--since=".length);

if (!sinceArg || !/^\d{4}-\d{2}-\d{2}$/.test(sinceArg) || Number.isNaN(Date.parse(sinceArg))) {
  console.error("Usage: pnpm resync:orders --since=YYYY-MM-DD [--dry-run] [--notify]");
  process.exit(1);
}

const since = Math.floor(Date.parse(sinceArg) / 1000);

const main = async () => {
  const stripe = getStripe();
  let synced = 0;
  let failed = 0;

  for await (const session of stripe.checkout.sessions.list({ limit: 100, status: "complete", created: { gte: since } })) {
    if (session.payment_status !== "paid" || !session.metadata?.orderId) continue;

    const label = `${new Date(session.created * 1000).toISOString().slice(0, 10)} ${session.id.slice(-10)}`;

    try {
      if (dryRun) {
        const order = await getOrderById(session.metadata.orderId);
        console.log(`${label} would sync (currently ${order?.paymentStatus ?? "missing in Mongo"})`);
        continue;
      }

      const order = await syncOrderFromStripeSession(session.id, { notify });
      synced += 1;
      console.log(
        `${label} -> ${order?.paymentStatus ?? "missing"}` +
          (notify ? ` receipt=${order?.customerReceiptStatus ?? "-"} owner=${order?.ownerNotificationStatus ?? "-"}` : "")
      );
    } catch (error) {
      failed += 1;
      console.error(`${label} failed: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(
    dryRun ? "Dry run, nothing changed." : `Synced ${synced} paid orders, ${failed} failed${notify ? " (emails on)" : " (emails off)"}.`
  );
  process.exit(failed ? 1 : 0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
