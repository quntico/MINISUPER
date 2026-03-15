
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");
  
  collection.fields.add(new Field({
    name: "provider",
    type: "text",
    required: false
  }));

  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("products");
  collection.fields.removeByName("provider");
  app.save(collection);
});
