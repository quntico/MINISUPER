
migrate((app) => {
    const companies = app.findCollectionByNameOrId("companies");
    
    if (!companies.fields.getByName("name_offset_x")) {
        companies.fields.addAt(19, new Field({
            name: "name_offset_x",
            type: "number",
            options: {}
        }));
    }
    
    if (!companies.fields.getByName("name_offset_y")) {
        companies.fields.addAt(20, new Field({
            name: "name_offset_y",
            type: "number",
            options: {}
        }));
    }
    
    app.save(companies);
}, (app) => {})
