
migrate((app) => {
    try {
        let comp;
        try {
            comp = app.findFirstRecordByData("companies", "slug", "minisuper");
        } catch (e) {
            const collection = app.findCollectionByNameOrId("companies");
            comp = new Record(collection);
            comp.set("name", "MINISUPER");
            comp.set("slug", "minisuper");
            app.save(comp);
        }

        let branch;
        try {
            branch = app.findFirstRecordByData("branches", "code", "SP-001");
        } catch (e) {
            const collection = app.findCollectionByNameOrId("branches");
            branch = new Record(collection);
            branch.set("company_id", comp.id);
            branch.set("name", "Sucursal Principal");
            branch.set("code", "SP-001");
            branch.set("is_main", true);
            branch.set("is_active", true);
            app.save(branch);
        }
    } catch (e) {
        console.log("Error creando datos iniciales: " + e.message);
    }
}, (app) => {})
