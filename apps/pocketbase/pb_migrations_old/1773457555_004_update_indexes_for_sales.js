/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("sales");
  collection.indexes.push("CREATE UNIQUE INDEX idx_sales_folio ON sales (folio)");
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sales");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_sales_folio"));
  return app.save(collection);
})
