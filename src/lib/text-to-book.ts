/**
 * Booking by text: patients text or call Jenny to pick a time (no online calendar).
 * The Text button opens the phone's Messages app with the request details already filled in.
 */
export const BOOKING_PHONE_E164 = "+18047389483";
export const BOOKING_PHONE_DISPLAY = "(804) 738-9483";

export const bookingTelHref = `tel:${BOOKING_PHONE_E164}` as const;

/**
 * `sms:` link with a prefilled body. "?&body=" is the form both iOS Messages and Android accept
 * (iOS reads "&body", Android reads "?body").
 */
export const bookingSmsHref = (message: string) => `sms:${BOOKING_PHONE_E164}?&body=${encodeURIComponent(message)}`;

const firstName = (name?: string) => name?.trim().split(/\s+/)[0] ?? "";

const greeting = (name?: string) => (firstName(name) ? `Hi Jenny, this is ${name!.trim()}.` : "Hi Jenny.");

const listJoin = (items: string[]) =>
  items.length <= 2 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;

/** Short order reference for texts, e.g. "956E105E" (the first 8 characters of the order id). */
export const shortOrderRef = (orderId: string) => orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();

export const TIMES_PROMPT = "Days and times that work for me:";

export const orderBookingMessage = (order: {
  orderId: string;
  customerName?: string;
  items: { name: string; quantity: number }[];
}) =>
  [
    greeting(order.customerName),
    `I paid online for ${listJoin(order.items.map((item) => (item.quantity > 1 ? `${item.quantity} x ${item.name}` : item.name)))} (order #${shortOrderRef(order.orderId)}) and would like to book my appointment.`,
    TIMES_PROMPT,
  ].join(" ");

export const consultBookingMessage = (request: { name?: string; interests: string[] }) =>
  [
    greeting(request.name),
    request.interests.length
      ? `I sent a consultation request on the website about ${listJoin(request.interests)}.`
      : "I sent a consultation request on the website.",
    TIMES_PROMPT,
  ].join(" ");

export const eventBookingMessage = (request: { name?: string }, eventName: string) =>
  [greeting(request.name), `I sent a ${eventName} planning request on the website and would like to set up a planning call.`, TIMES_PROMPT].join(
    " "
  );
