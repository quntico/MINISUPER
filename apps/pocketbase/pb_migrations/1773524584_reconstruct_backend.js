
migrate((app) => {
    // Helper to create and return ID
    const create = (data) => {
        const c = new Collection(data);
        app.save(c);
        return app.findCollectionByNameOrId(data.name).id;
    };

    const rolesId = create({
        name: "roles", type: "base",
        fields: [
            { name: "name", type: "text", required: true, unique: true },
            { name: "description", type: "text" }
        ],
        listRule: "", viewRule: ""
    });

    const permsId = create({
        name: "permissions", type: "base",
        fields: [
            { name: "name", type: "text", required: true },
            { name: "module", type: "text", required: true }
        ],
        listRule: "", viewRule: ""
    });

    const compsId = create({
        name: "companies", type: "base",
        fields: [
            { name: "name", type: "text", required: true },
            { name: "slug", type: "text", required: true, unique: true },
            { name: "phone", type: "text" },
            { name: "email", type: "email" },
            { name: "address", type: "text" },
            { name: "logo", type: "file", maxSelect: 1 }
        ],
        listRule: "", viewRule: ""
    });

    const brsId = create({
        name: "branches", type: "base",
        fields: [
            { name: "company_id", type: "relation", required: true, maxSelect: 1, collectionId: compsId },
            { name: "name", type: "text", required: true },
            { name: "code", type: "text", required: true },
            { name: "address", type: "text" },
            { name: "phone", type: "text" },
            { name: "is_main", type: "bool" },
            { name: "is_active", type: "bool" }
        ],
        listRule: "", viewRule: ""
    });

    const prodsId = create({
        name: "products", type: "base",
        fields: [
            { name: "barcode", type: "text" },
            { name: "name", type: "text", required: true },
            { name: "description", type: "text" },
            { name: "price", type: "number", required: true },
            { name: "cost", type: "number" },
            { name: "stock", type: "number" },
            { name: "category", type: "text" },
            { name: "company_id", type: "relation", required: true, maxSelect: 1, collectionId: compsId },
            { name: "branch_id", type: "relation", required: true, maxSelect: 1, collectionId: brsId },
            { name: "is_active", type: "bool" }
        ],
        listRule: "", viewRule: ""
    });

    const invsId = create({
        name: "inventory", type: "base",
        fields: [
            { name: "product_id", type: "relation", required: true, maxSelect: 1, collectionId: prodsId },
            { name: "branch_id", type: "relation", required: true, maxSelect: 1, collectionId: brsId },
            { name: "stock", type: "number", required: true },
            { name: "min_stock", type: "number" },
            { name: "last_update", type: "date" }
        ],
        listRule: "", viewRule: ""
    });

    const usersColl = app.findCollectionByNameOrId("users");
    const usersId = usersColl.id;

    const salesId = create({
        name: "sales", type: "base",
        fields: [
            { name: "ticket_number", type: "text", required: true, unique: true },
            { name: "branch_id", type: "relation", required: true, maxSelect: 1, collectionId: brsId },
            { name: "user_id", type: "relation", required: true, maxSelect: 1, collectionId: usersId },
            { name: "total", type: "number", required: true },
            { name: "payment_method", type: "text" }
        ],
        listRule: "", viewRule: ""
    });

    create({
        name: "tickets", type: "base",
        fields: [
            { name: "sale_id", type: "relation", required: true, maxSelect: 1, collectionId: salesId },
            { name: "product_id", type: "relation", required: true, maxSelect: 1, collectionId: prodsId },
            { name: "price", type: "number", required: true },
            { name: "quantity", type: "number", required: true },
            { name: "total", type: "number", required: true }
        ],
        listRule: "", viewRule: ""
    });

    create({
        name: "payments", type: "base",
        fields: [
            { name: "sale_id", type: "relation", required: true, maxSelect: 1, collectionId: salesId },
            { name: "method", type: "text", required: true },
            { name: "amount", type: "number", required: true }
        ],
        listRule: "", viewRule: ""
    });

    // SEED DATA
    const comp = new Record(app.findCollectionByNameOrId(compsId));
    comp.set("name", "MINISUPER");
    comp.set("slug", "minisuper");
    app.save(comp);

    const br = new Record(app.findCollectionByNameOrId(brsId));
    br.set("company_id", comp.id);
    br.set("name", "Sucursal Principal");
    br.set("code", "SP-001");
    br.set("is_main", true);
    br.set("is_active", true);
    app.save(br);

    const roleMap = {};
    ["SUPER_ADMIN", "ADMIN", "MANAGER", "CASHIER", "INVENTORY"].forEach(name => {
        const r = new Record(app.findCollectionByNameOrId(rolesId));
        r.set("name", name);
        app.save(r);
        roleMap[name] = r.id;
    });

    const admin = new Record(usersColl);
    admin.set("email", "admin@minisuper.local");
    admin.set("password", "admin123");
    admin.set("passwordConfirm", "admin123");
    admin.set("name", "Administrador");
    admin.set("verified", true);
    app.save(admin);

}, (app) => {
    // revert
})
