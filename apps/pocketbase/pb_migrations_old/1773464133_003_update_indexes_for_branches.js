/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("branches");
  collection.indexes.push("CREATE UNIQUE INDEX idx_branches_code ON branches (code)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("branches");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_branches_code"));
  return app.save(collection);
})
