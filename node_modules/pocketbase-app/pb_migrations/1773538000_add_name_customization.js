
migrate((app) => {
    const companies = app.findCollectionByNameOrId("companies");
    
    if (!companies.fields.getByName("name_size")) {
        companies.fields.addAt(15, new Field({
            name: "name_size",
            type: "number",
            options: { min: 8, max: 72 }
        }));
    }
    
    if (!companies.fields.getByName("name_color")) {
        companies.fields.addAt(16, new Field({
            name: "name_color",
            type: "text",
            options: { pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }
        }));
    }
    
    app.save(companies);
}, (app) => {})
