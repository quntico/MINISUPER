
/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // En PocketBase: null = solo superusuarios, "" = acceso público libre
  const collections = [
    "companies", "branches", "products", "inventory",
    "sales", "tickets", "payments", "roles", "permissions"
  ];

  collections.forEach(name => {
    try {
      const col = app.findCollectionByNameOrId(name);
      col.listRule   = "";  // "" = público: cualquier usuario puede listar
      col.viewRule   = "";
      col.createRule = "";
      col.updateRule = "";
      col.deleteRule = "";
      app.save(col);
      console.log(`✅ ${name}: acceso público total`);
    } catch (e) {
      console.warn(`⚠️ ${name}: ${e}`);
    }
  });

}, (app) => {});
