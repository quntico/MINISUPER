/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("branches");

  const record0 = new Record(collection);
    const record0_company_idLookup = app.findFirstRecordByFilter("companies", "slug='techstore-retail'");
    if (!record0_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"slug='techstore-retail'\""); }
    record0.set("company_id", record0_company_idLookup.id);
    record0.set("name", "Downtown Store");
    record0.set("code", "DT-001");
    record0.set("address", "123 Commerce Street");
    record0.set("city", "San Francisco");
    record0.set("state", "CA");
    record0.set("postal_code", "94105");
    record0.set("phone", "+1-555-0100");
    record0.set("email", "downtown@techstore.com");
    record0.set("manager", "John Smith");
    record0.set("is_main", true);
    record0.set("is_active", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
