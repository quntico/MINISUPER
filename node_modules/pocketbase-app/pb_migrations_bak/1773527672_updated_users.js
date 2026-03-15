/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2536409462",
    "hidden": false,
    "id": "relation3705064521",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "branch_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2105053228",
    "hidden": false,
    "id": "relation3590529708",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "role_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("relation3705064521")

  // remove field
  collection.fields.removeById("relation3590529708")

  return app.save(collection)
})
