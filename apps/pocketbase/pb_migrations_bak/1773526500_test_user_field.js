
migrate((app) => {
    // 1. Get Users Collection
    const users = app.findCollectionByNameOrId("users");
    
    // 2. Add only ONE field to test stability
    const fields = JSON.parse(JSON.stringify(users.fields));
    if (!fields.find(f => f.name === "company_id")) {
        fields.push({
            name: "company_id",
            type: "relation",
            required: false,
            options: { collectionId: "pbc_comps_00001", maxSelect: 1 }
        });
    }
    
    users.fields = fields;
    
    try {
        app.save(users);
        console.log("Users schema updated successfully");
    } catch (e) {
        console.log("Failed to save users collection: " + e.message);
    }
})
