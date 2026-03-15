
migrate((app) => {
    // 1. Ampliar tabla de empresas
    const companies = app.findCollectionByNameOrId("companies");
    const cFields = JSON.parse(JSON.stringify(companies.fields));
    
    const newCFields = [
        { name: "rfc", type: "text" },
        { name: "razon_social", type: "text" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "zip", type: "text" },
        { name: "description", type: "text" }
    ];

    newCFields.forEach(nf => {
        if (!companies.fields.getByName(nf.name)) {
            companies.fields.addAt(10, new Field(nf));
        }
    });

    // Habilitar permisos de edición
    companies.updateRule = "";
    companies.createRule = "";
    app.save(companies);

    // 2. Ampliar tabla de sucursales
    const branches = app.findCollectionByNameOrId("branches");
    const newBFields = [
        { name: "email", type: "email" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "zip", type: "text" },
        { name: "manager", type: "text" },
        { name: "opening_time", type: "text" },
        { name: "closing_time", type: "text" }
    ];

    newBFields.forEach(nf => {
        if (!branches.fields.getByName(nf.name)) {
            branches.fields.addAt(10, new Field(nf));
        }
    });

    // Habilitar permisos de edición
    branches.updateRule = "";
    branches.createRule = "";
    app.save(branches);

}, (app) => {})
