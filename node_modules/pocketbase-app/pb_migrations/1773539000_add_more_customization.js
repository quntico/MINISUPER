
migrate((app) => {
    const companies = app.findCollectionByNameOrId("companies");
    
    if (!companies.fields.getByName("logo_size")) {
        companies.fields.addAt(17, new Field({
            name: "logo_size",
            type: "number",
            options: { min: 20, max: 120 }
        }));
    }
    
    if (!companies.fields.getByName("submenu_color")) {
        companies.fields.addAt(18, new Field({
            name: "submenu_color",
            type: "text",
            options: { pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" }
        }));
    }
    
    app.save(companies);
}, (app) => {})
