/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Coca Cola 2L");
    record0.set("sku", "COCA2L");
    record0.set("barcode", "7501234567890");
    record0.set("category", "Bebidas");
    record0.set("price", 2.5);
    record0.set("cost", 1.5);
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
    record1.set("barcode", "7501234567891");
    record1.set("category", "Bebidas");
    record1.set("price", 2.5);
    record1.set("cost", 1.5);
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
    record2.set("barcode", "7501234567892");
    record2.set("category", "Bebidas");
    record2.set("price", 1.0);
    record2.set("cost", 0.6);
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
    record3.set("name", "Jugo Natural 1L");
    record3.set("sku", "JUGO1L");
    record3.set("barcode", "7501234567893");
    record3.set("category", "Bebidas");
    record3.set("price", 3.0);
    record3.set("cost", 1.8);
    record3.set("stock", 30);
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
    record4.set("name", "Cerveza 355ml");
    record4.set("sku", "CERV355");
    record4.set("barcode", "7501234567894");
    record4.set("category", "Bebidas");
    record4.set("price", 1.5);
    record4.set("cost", 0.9);
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
    record5.set("name", "Papas Fritas 100g");
    record5.set("sku", "PAPAS100");
    record5.set("barcode", "7501234567895");
    record5.set("category", "Snacks");
    record5.set("price", 1.5);
    record5.set("cost", 0.9);
    record5.set("stock", 80);
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
    record6.set("name", "Galletas Oreo");
    record6.set("sku", "OREO");
    record6.set("barcode", "7501234567896");
    record6.set("category", "Snacks");
    record6.set("price", 2.0);
    record6.set("cost", 1.2);
    record6.set("stock", 60);
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
    record7.set("name", "Chocolate Hershey's");
    record7.set("sku", "CHOCO");
    record7.set("barcode", "7501234567897");
    record7.set("category", "Snacks");
    record7.set("price", 1.8);
    record7.set("cost", 1.08);
    record7.set("stock", 50);
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
    record8.set("name", "Chicles Trident");
    record8.set("sku", "CHICLE");
    record8.set("barcode", "7501234567898");
    record8.set("category", "Snacks");
    record8.set("price", 0.5);
    record8.set("cost", 0.3);
    record8.set("stock", 100);
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
    record9.set("name", "Man\u00ed Salado");
    record9.set("sku", "MANI");
    record9.set("barcode", "7501234567899");
    record9.set("category", "Snacks");
    record9.set("price", 2.5);
    record9.set("cost", 1.5);
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

  const record10 = new Record(collection);
    record10.set("name", "Leche Entera 1L");
    record10.set("sku", "LECHE1L");
    record10.set("barcode", "7501234567900");
    record10.set("category", "Lacteos");
    record10.set("price", 1.8);
    record10.set("cost", 1.08);
    record10.set("stock", 70);
    record10.set("tax", 0.16);
    record10.set("active", true);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Yogurt Natural 500ml");
    record11.set("sku", "YOGURT500");
    record11.set("barcode", "7501234567901");
    record11.set("category", "Lacteos");
    record11.set("price", 2.2);
    record11.set("cost", 1.32);
    record11.set("stock", 50);
    record11.set("tax", 0.16);
    record11.set("active", true);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("name", "Queso Fresco 500g");
    record12.set("sku", "QUESO500");
    record12.set("barcode", "7501234567902");
    record12.set("category", "Lacteos");
    record12.set("price", 5.5);
    record12.set("cost", 3.3);
    record12.set("stock", 25);
    record12.set("tax", 0.16);
    record12.set("active", true);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("name", "Mantequilla 250g");
    record13.set("sku", "MANT250");
    record13.set("barcode", "7501234567903");
    record13.set("category", "Lacteos");
    record13.set("price", 4.0);
    record13.set("cost", 2.4);
    record13.set("stock", 30);
    record13.set("tax", 0.16);
    record13.set("active", true);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("name", "Crema \u00c1cida 200ml");
    record14.set("sku", "CREMA200");
    record14.set("barcode", "7501234567904");
    record14.set("category", "Lacteos");
    record14.set("price", 2.5);
    record14.set("cost", 1.5);
    record14.set("stock", 20);
    record14.set("tax", 0.16);
    record14.set("active", true);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("name", "Arroz 1kg");
    record15.set("sku", "ARROZ1K");
    record15.set("barcode", "7501234567905");
    record15.set("category", "Abarrotes");
    record15.set("price", 3.5);
    record15.set("cost", 2.1);
    record15.set("stock", 100);
    record15.set("tax", 0.16);
    record15.set("active", true);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("name", "Frijoles 1kg");
    record16.set("sku", "FRIJOLES1K");
    record16.set("barcode", "7501234567906");
    record16.set("category", "Abarrotes");
    record16.set("price", 4.0);
    record16.set("cost", 2.4);
    record16.set("stock", 80);
    record16.set("tax", 0.16);
    record16.set("active", true);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("name", "Aceite Vegetal 1L");
    record17.set("sku", "ACEITE1L");
    record17.set("barcode", "7501234567907");
    record17.set("category", "Abarrotes");
    record17.set("price", 5.5);
    record17.set("cost", 3.3);
    record17.set("stock", 40);
    record17.set("tax", 0.16);
    record17.set("active", true);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("name", "Sal 1kg");
    record18.set("sku", "SAL1K");
    record18.set("barcode", "7501234567908");
    record18.set("category", "Abarrotes");
    record18.set("price", 1.5);
    record18.set("cost", 0.9);
    record18.set("stock", 60);
    record18.set("tax", 0.16);
    record18.set("active", true);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("name", "Az\u00facar 1kg");
    record19.set("sku", "AZUCAR1K");
    record19.set("barcode", "7501234567909");
    record19.set("category", "Abarrotes");
    record19.set("price", 2.5);
    record19.set("cost", 1.5);
    record19.set("stock", 50);
    record19.set("tax", 0.16);
    record19.set("active", true);
  try {
    app.save(record19);
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
