/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("companies");
  collection.indexes.push("CREATE UNIQUE INDEX idx_companies_slug ON companies (slug)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("companies");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_companies_slug"));
  return app.save(collection);
})
