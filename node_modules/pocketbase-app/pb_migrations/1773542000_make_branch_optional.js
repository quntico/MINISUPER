
/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // 1. Hacer branch_id OPCIONAL en 'products'
  try {
    const productsCol = app.findCollectionByNameOrId("products");
    const branchField = productsCol.fields.getByName("branch_id");
    if (branchField) {
      branchField.required = false;
      app.save(productsCol);
      console.log("✅ products.branch_id ahora es opcional");
    }
  } catch (e) {
    console.error("Error actualizando products.branch_id:", e);
  }

  // 2. Hacer branch_id OPCIONAL en 'inventory'
  try {
    const inventoryCol = app.findCollectionByNameOrId("inventory");
    const branchField = inventoryCol.fields.getByName("branch_id");
    if (branchField) {
      branchField.required = false;
      app.save(inventoryCol);
      console.log("✅ inventory.branch_id ahora es opcional");
    }
  } catch (e) {
    console.error("Error actualizando inventory.branch_id:", e);
  }

  // 3. Hacer 'code' OPCIONAL en 'branches' (para poder crear sucursales sin código)
  try {
    const branchesCol = app.findCollectionByNameOrId("branches");
    const codeField = branchesCol.fields.getByName("code");
    if (codeField) {
      codeField.required = false;
      app.save(branchesCol);
      console.log("✅ branches.code ahora es opcional");
    }
  } catch (e) {
    console.error("Error actualizando branches.code:", e);
  }

  // 4. Abrir reglas de acceso en 'branches' para permitir consultas con filtro
  try {
    const branchesCol = app.findCollectionByNameOrId("branches");
    branchesCol.listRule = "";
    branchesCol.viewRule = "";
    branchesCol.createRule = "";
    branchesCol.updateRule = "";
    app.save(branchesCol);
    console.log("✅ branches: reglas de acceso abiertas");
  } catch (e) {
    console.error("Error actualizando reglas de branches:", e);
  }

}, (app) => {
  // Revert: volver a hacer branch_id requerido
  try {
    const productsCol = app.findCollectionByNameOrId("products");
    const branchField = productsCol.fields.getByName("branch_id");
    if (branchField) { branchField.required = true; app.save(productsCol); }
  } catch (e) {}
  try {
    const inventoryCol = app.findCollectionByNameOrId("inventory");
    const branchField = inventoryCol.fields.getByName("branch_id");
    if (branchField) { branchField.required = true; app.save(inventoryCol); }
  } catch (e) {}
});
