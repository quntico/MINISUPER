
/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // Abrir TODAS las reglas para todas las colecciones clave
  // Permite tanto acceso anónimo como autenticado
  const collections = [
    "companies", "branches", "products", "inventory",
    "sales", "tickets", "payments", "roles",
    "permissions", "user_roles"
  ];

  collections.forEach(name => {
    try {
      const col = app.findCollectionByNameOrId(name);
      col.listRule   = null;  // null = sin restriccion (público/admin)
      col.viewRule   = null;
      col.createRule = null;
      col.updateRule = null;
      col.deleteRule = null;
      app.save(col);
      console.log(`✅ ${name}: reglas totalmente abiertas (null)`);
    } catch (e) {
      console.warn(`⚠️ No se pudo abrir ${name}: ${e}`);
    }
  });

}, (app) => {});
