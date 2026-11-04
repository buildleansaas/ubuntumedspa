import assert from "node:assert/strict";
import test from "node:test";

import { bookingSmsHref, shortOrderRef, consultBookingMessage, eventBookingMessage, orderBookingMessage } from "./text-to-book";

test("the sms link opens a text to Jenny with the message prefilled", () => {
  const href = bookingSmsHref("Hi Jenny & team? 100%");
  assert.equal(href, "sms:+18047389483?&body=Hi%20Jenny%20%26%20team%3F%20100%25");
});

test("order message names the buyer, items, and order id", () => {
  assert.equal(
    orderBookingMessage({
      orderId: "WMS-123",
      customerName: " Pat Lee ",
      items: [
        { name: "Blomdahl Ear Piercing", quantity: 2 },
        { name: "PRP Facial", quantity: 1 },
      ],
    }),
    "Hi Jenny, this is Pat Lee. I paid online for 2 x Blomdahl Ear Piercing and PRP Facial (order #WMS123) and would like to book my appointment. Days and times that work for me:"
  );
});

test("messages still read cleanly without a name or interests", () => {
  assert.equal(
    orderBookingMessage({ orderId: "WMS-1", items: [{ name: "Xeomin", quantity: 1 }] }),
    "Hi Jenny. I paid online for Xeomin (order #WMS1) and would like to book my appointment. Days and times that work for me:"
  );
  assert.equal(
    consultBookingMessage({ name: "", interests: [] }),
    "Hi Jenny. I sent a consultation request on the website. Days and times that work for me:"
  );
  assert.equal(
    consultBookingMessage({ name: "Sam", interests: ["PRP Facial", "Microneedling", "Xeomin"] }),
    "Hi Jenny, this is Sam. I sent a consultation request on the website about PRP Facial, Microneedling, and Xeomin. Days and times that work for me:"
  );
  assert.equal(
    eventBookingMessage({ name: "Ana" }, "Botox Party"),
    "Hi Jenny, this is Ana. I sent a Botox Party planning request on the website and would like to set up a planning call. Days and times that work for me:"
  );
});

test("short order ref is the first 8 alphanumerics of the order id, uppercased", () => {
  assert.equal(shortOrderRef("956e105e-20ff-406c-981c-22f133144da3"), "956E105E");
});

test("pickup-only products are left out of the booking text", () => {
  assert.equal(
    orderBookingMessage({
      orderId: "abc12345-x",
      customerName: "Pat",
      items: [
        { name: "Xeomin", quantity: 1, fulfillment: "appointment" },
        { name: "Aftercare Kit", quantity: 1, fulfillment: "pickup" },
      ],
    }),
    "Hi Jenny, this is Pat. I paid online for Xeomin (order #ABC12345) and would like to book my appointment. Days and times that work for me:"
  );
});
