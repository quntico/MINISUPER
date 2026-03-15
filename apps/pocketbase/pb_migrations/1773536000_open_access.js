
migrate((app) => {
    // 1. Asegurar Empresa y Sucursal por defecto
    let comp;
    try {
        comp = app.findFirstRecordByData("companies", "slug", "default");
    } catch (e) {
        const collection = app.findCollectionByNameOrId("companies");
        comp = new Record(collection);
        comp.set("name", "Mi Negocio");
        comp.set("slug", "default");
        app.save(comp);
    }

    let branch;
    try {
        branch = app.findFirstRecordByData("branches", "code", "MAIN");
    } catch (e) {
        const collection = app.findCollectionByNameOrId("branches");
        branch = new Record(collection);
        branch.set("company_id", comp.id);
        branch.set("name", "Sucursal Principal");
        branch.set("code", "MAIN");
        branch.set("is_main", true);
        branch.set("is_active", true);
        app.save(branch);
    }

    // 2. Abrir TODAS las reglas para que la web pueda trabajar libremente
    const collections = ["companies", "branches", "products", "inventory", "categories"];
    collections.forEach(name => {
        try {
            const col = app.findCollectionByNameOrId(name);
            col.listRule = "";
            col.viewRule = "";
            col.createRule = "";
            col.updateRule = "";
            col.deleteRule = "";
            app.save(col);
        } catch(e) {}
    });

}, (app) => {})
