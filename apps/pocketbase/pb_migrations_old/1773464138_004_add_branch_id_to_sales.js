/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const branchesCollection = app.findCollectionByNameOrId("branches");
  const collection = app.findCollectionByNameOrId("sales");

  const existing = collection.fields.getByName("branch_id");
  if (existing) {
    if (existing.type === "relation") {
      return; // field already exists with correct type, skip
    }
    collection.fields.removeByName("branch_id"); // exists with wrong type, remove first
  }

  collection.fields.add(new RelationField({
    name: "branch_id",
    collectionId: branchesCollection.id
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("sales");
  collection.fields.removeByName("branch_id");
  return app.save(collection);
})
