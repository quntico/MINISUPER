/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3866053794")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool1542800728",
    "name": "field",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3866053794")

  // remove field
  collection.fields.removeById("bool1542800728")

  return app.save(collection)
})
