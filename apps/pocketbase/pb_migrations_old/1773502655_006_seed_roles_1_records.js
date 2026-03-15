/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("roles");

  const record0 = new Record(collection);
    const record0_company_idLookup = app.findFirstRecordByFilter("companies", "slug='techstore-retail'");
    if (!record0_company_idLookup) { throw new Error("Lookup failed for company_id: no record in 'companies' matching \"slug='techstore-retail'\""); }
    record0.set("company_id", record0_company_idLookup.id);
    record0.set("name", "Administrator");
    record0.set("description", "Full access to all features");
    record0.set("permissions", ["pos.view", "pos.create_sale", "pos.cancel_sale", "pos.print_ticket", "pos.refund", "products.view", "products.create", "products.edit", "products.delete", "products.import", "products.export", "inventory.view", "inventory.edit", "inventory.adjust", "inventory.count", "inventory.import", "inventory.export", "reports.view", "reports.export", "reports.print", "users.view", "users.create", "users.edit", "users.delete", "settings.view", "settings.edit"]);
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
