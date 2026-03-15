/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("permissions");
  collection.indexes.push("CREATE UNIQUE INDEX idx_permissions_name ON permissions (name)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("permissions");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_permissions_name"));
  return app.save(collection);
})
