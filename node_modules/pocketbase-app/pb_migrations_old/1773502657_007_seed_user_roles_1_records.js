/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("user_roles");

  const record0 = new Record(collection);
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='admin@techstore.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='admin@techstore.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    const record0_company_idLookup = app.findFirstRecordByFilter("companies", "slug='techstore-retail'");
    if (!record0_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"slug='techstore-retail'\""); }
    record0.set("company_id", record0_company_idLookup.id);
    const record0_role_idLookup = app.findFirstRecordByFilter("roles", "name='Administrator'");
    if (!record0_role_idLookup) { throw new Error("Lookup failed for role_id: no record in 'roles' matching \"name='Administrator'\""); }
    record0.set("role_id", record0_role_idLookup.id);
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
