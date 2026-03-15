
import PocketBase from 'pocketbase';

async function fixSchema() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    
    try {
        await pb.admins.authWithPassword('admin@minisuper.local', 'admin123');
        console.log('Authenticated');

        // Get users collection
        const users = await pb.collections.getOne('users');
        
        // Find company_id field
        const companyFieldIdx = users.fields.findIndex(f => f.name === 'company_id');
        
        if (companyFieldIdx !== -1) {
            // Update relation to companies
            users.fields[companyFieldIdx].relation = {
                collectionId: 'pbc_comps_00001',
                maxSelect: 1
            };
            
            await pb.collections.update('users', users);
            console.log('Users schema fixed (company_id linked to companies)');
        }

        // Now update admin user record
        const admin = await pb.collection('users').getFirstListItem('email="admin@minisuper.local"');
        const company = await pb.collection('companies').getFirstListItem('slug="minisuper"');
        const branch = await pb.collection('branches').getFirstListItem('code="SP-001"');
        const role = await pb.collection('roles').getFirstListItem('name="SUPER_ADMIN"');

        await pb.collection('users').update(admin.id, {
            company_id: company.id,
            branch_id: branch.id,
            role_id: role.id,
            is_active: true
        });
        console.log('Admin user updated with relations');

    } catch (err) {
        console.error('Error:', err.message);
        if (err.data) console.error('Details:', JSON.stringify(err.data));
    }
}

fixSchema();
