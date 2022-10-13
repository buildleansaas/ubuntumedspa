import Airtable from "airtable";
const AIRTABLE_DEV_KEY = "keyUQMdVRiPVaVr3v";
const BASE_KEY = "apps3GXm9v0impIOz";

const Client = Airtable.configure({ apiKey: AIRTABLE_DEV_KEY });
const LeadsTable = Airtable.base(BASE_KEY).table("Table 1");

export default Client;
export { LeadsTable };
