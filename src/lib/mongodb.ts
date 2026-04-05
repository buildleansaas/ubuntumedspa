import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __wmsMongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var __wmsMongoIndexesPromise: Promise<void> | undefined;
}

const getMongoUri = () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is required.");
  return mongoUri;
};

const createMongoClientPromise = async () => {
  const client = new MongoClient(getMongoUri(), {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });
  try {
    await client.connect();
    return client;
  } catch (error) {
    global.__wmsMongoClientPromise = undefined;
    throw error;
  }
};

export const getMongoClient = () => {
  if (!global.__wmsMongoClientPromise) {
    global.__wmsMongoClientPromise = createMongoClientPromise();
  }

  return global.__wmsMongoClientPromise;
};

export const getDb = async () => {
  const client = await getMongoClient();
  return client.db();
};

const ensureIndexes = async () => {
  const db = await getDb();

  await Promise.all([
    db.collection("accounts").createIndex({ normalizedEmail: 1 }, { unique: true }),
    db.collection("orders").createIndex({ orderId: 1 }, { unique: true }),
    db.collection("orders").createIndex({ publicToken: 1 }, { unique: true }),
    db.collection("consult_requests").createIndex({ token: 1 }, { unique: true }),
    db.collection("consult_requests").createIndex({ consultRequestId: 1 }, { unique: true }),
    db.collection("event_requests").createIndex({ token: 1 }, { unique: true }),
    db.collection("event_requests").createIndex({ eventRequestId: 1 }, { unique: true }),
    db.collection("event_requests").createIndex({ eventSlug: 1 }),
    db.collection("affiliates").createIndex({ affiliateId: 1 }, { unique: true }),
    db.collection("affiliates").createIndex({ affiliateCode: 1 }, { unique: true }),
    db.collection("affiliates").createIndex({ accountId: 1 }, { unique: true }),
    db.collection("affiliate_code_aliases").createIndex({ aliasCode: 1 }, { unique: true }),
    db.collection("affiliate_code_aliases").createIndex({ affiliateId: 1 }),
    db.collection("appointments").createIndex({ bookingUid: 1 }, { unique: true, sparse: true }),
    db.collection("credit_ledger").createIndex({ entryKey: 1 }, { unique: true }),
    db.collection("catalog_items").createIndex({ slug: 1 }, { unique: true }),
  ]);
};

export const ensureMongoIndexes = async () => {
  if (!global.__wmsMongoIndexesPromise) {
    global.__wmsMongoIndexesPromise = ensureIndexes().catch((error) => {
      global.__wmsMongoIndexesPromise = undefined;
      throw error;
    });
  }

  return global.__wmsMongoIndexesPromise;
};
