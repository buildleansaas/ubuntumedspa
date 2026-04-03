import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var __wmsStripeClient: Stripe | undefined;
}

export const getStripe = () => {
  if (!process.env.STRIPE_PRIVATE_KEY) throw new Error("STRIPE_PRIVATE_KEY is required.");

  if (!global.__wmsStripeClient) {
    global.__wmsStripeClient = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
      appInfo: {
        name: "williamsburgmedspa.com",
      },
    });
  }

  return global.__wmsStripeClient;
};
