/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("companies");

  const record0 = new Record(collection);
    record0.set("name", "TechStore Retail");
    record0.set("slug", "techstore-retail");
    record0.set("email", "admin@techstore.com");
    record0.set("phone", "+1-555-0100");
    record0.set("address", "123 Commerce Street");
    record0.set("city", "San Francisco");
    record0.set("state", "CA");
    record0.set("postal_code", "94105");
    record0.set("country", "United States");
    record0.set("tax_id", "98-1234567");
    record0.set("industry", "Retail - Electronics");
    record0.set("subscription_plan", "pro");
    record0.set("subscription_status", "active");
    record0.set("max_users", 50);
    record0.set("max_branches", 10);
    record0.set("max_products", 10000);
    record0.set("features", "{'pos': True, 'inventory': True, 'reports': True, 'users': True, 'settings': True, 'analytics': True, 'multi_branch': True}");
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
