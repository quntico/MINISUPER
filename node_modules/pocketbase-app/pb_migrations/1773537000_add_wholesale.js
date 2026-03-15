
migrate((app) => {
    const products = app.findCollectionByNameOrId("products");
    
    if (!products.fields.getByName("wholesale_price")) {
        products.fields.addAt(7, new Field({
            name: "wholesale_price",
            type: "number",
            options: { min: 0 }
        }));
        app.save(products);
    }
}, (app) => {})
