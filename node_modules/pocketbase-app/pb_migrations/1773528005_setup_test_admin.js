
migrate((app) => {
    try {
        const admin = app.findFirstRecordByData("users", "email", "admin@minisuper.local");
        const comp = app.findFirstRecordByData("companies", "slug", "minisuper");
        const branch = app.findFirstRecordByData("branches", "code", "SP-001");

        if (admin && comp && branch) {
            // Asignar IDs de forma segura
            admin.set("company_id", comp.id);
            admin.set("branch_id", branch.id);
            app.save(admin);
            console.log("Admin actualizado con exito para las pruebas.");
        }
    } catch (e) {
        console.log("Error en setup de prueba: " + e.message);
    }
}, (app) => {})
