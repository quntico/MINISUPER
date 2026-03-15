/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Coca Cola 2L");
    record0.set("sku", "COCA2L");
    record0.set("category", "Bebidas");
    record0.set("price", 2.5);
    record0.set("stock", 50);
    record0.set("tax", 0.16);
    record0.set("active", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("name", "Sprite 2L");
    record1.set("sku", "SPRI2L");
    record1.set("category", "Bebidas");
    record1.set("price", 2.5);
    record1.set("stock", 40);
    record1.set("tax", 0.16);
    record1.set("active", true);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("name", "Agua Purificada 1L");
    record2.set("sku", "AGUA1L");
    record2.set("category", "Bebidas");
    record2.set("price", 1.0);
    record2.set("stock", 100);
    record2.set("tax", 0.16);
    record2.set("active", true);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("name", "Papas Fritas 100g");
    record3.set("sku", "PAPAS100");
    record3.set("category", "Snacks");
    record3.set("price", 1.5);
    record3.set("stock", 80);
    record3.set("tax", 0.16);
    record3.set("active", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Galletas Oreo");
    record4.set("sku", "OREO");
    record4.set("category", "Snacks");
    record4.set("price", 2.0);
    record4.set("stock", 60);
    record4.set("tax", 0.16);
    record4.set("active", true);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Leche Entera 1L");
    record5.set("sku", "LECHE1L");
    record5.set("category", "Lacteos");
    record5.set("price", 1.8);
    record5.set("stock", 70);
    record5.set("tax", 0.16);
    record5.set("active", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Yogurt Natural 500ml");
    record6.set("sku", "YOGURT500");
    record6.set("category", "Lacteos");
    record6.set("price", 2.2);
    record6.set("stock", 50);
    record6.set("tax", 0.16);
    record6.set("active", true);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Arroz 1kg");
    record7.set("sku", "ARROZ1K");
    record7.set("category", "Abarrotes");
    record7.set("price", 3.5);
    record7.set("stock", 100);
    record7.set("tax", 0.16);
    record7.set("active", true);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Frijoles 1kg");
    record8.set("sku", "FRIJOLES1K");
    record8.set("category", "Abarrotes");
    record8.set("price", 4.0);
    record8.set("stock", 80);
    record8.set("tax", 0.16);
    record8.set("active", true);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Aceite Vegetal 1L");
    record9.set("sku", "ACEITE1L");
    record9.set("category", "Abarrotes");
    record9.set("price", 5.5);
    record9.set("stock", 40);
    record9.set("tax", 0.16);
    record9.set("active", true);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
