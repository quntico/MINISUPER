/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "admin@techstore.com");
  record.setPassword("Admin@123456");
  record.set("name", "Admin User");
  const record_company_idLookup = app.findFirstRecordByFilter("companies", "slug='techstore-retail'");
  if (!record_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"slug='techstore-retail'\""); }
  record.set("company_id", record_company_idLookup.id);
  record.set("is_active", true);
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const record = app.findFirstRecordByData("users", "email", "admin@techstore.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
