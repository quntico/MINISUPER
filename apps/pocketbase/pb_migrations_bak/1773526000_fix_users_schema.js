
migrate((app) => {
    const users = app.findCollectionByNameOrId("users");
    if (!users) return;

    // Helper to add relation field safely
    const addSafeRelation = (name, targetName) => {
        try {
            const target = app.findCollectionByNameOrId(targetName);
            if (!target) {
                console.log("No se encontro coleccion: " + targetName);
                return;
            }

            users.fields.addAt(10, new Field({
                "name": name,
                "type": "relation",
                "options": {
                    "collectionId": target.id,
                    "maxSelect": 1
                }
            }));
        } catch (e) {
            console.log("Error agregando " + name + ": " + e.message);
        }
    };

    addSafeRelation("company_id", "companies");
    addSafeRelation("branch_id", "branches");
    addSafeRelation("role_id", "roles");

    try {
        users.fields.addAt(13, new Field({
            "name": "is_active",
            "type": "bool"
        }));
    } catch (e) {}

    app.save(users);

    // Update admin
    try {
        const admin = app.findFirstRecordByData("users", "email", "admin@minisuper.local");
        const comp = app.findFirstRecordByData("companies", "slug", "minisuper");
        const branch = app.findFirstRecordByData("branches", "code", "SP-001");
        const role = app.findFirstRecordByData("roles", "name", "SUPER_ADMIN");

        if (admin && comp && branch && role) {
            admin.set("company_id", comp.id);
            admin.set("branch_id", branch.id);
            admin.set("role_id", role.id);
            admin.set("is_active", true);
            app.save(admin);
        }
    } catch (e) {}
}, (app) => {})
