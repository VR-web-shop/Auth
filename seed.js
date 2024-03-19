import 'dotenv/config'
import Database from './src/models/Database.js';

import RolePermission from './src/models/RolePermission.js';
import Role, { ROLES } from './src/models/Role.js';
import Permission, { PERMISSIONS } from './src/models/Permission.js';
import User from './src/models/User.js';

(async () => {
    try {
        await Database.sync({ force: true });
    } catch (error) {
        console.log('Error syncing database: ', error);
    }

    for (const permissionCategory of Object.values(PERMISSIONS)) {
        for (const permission of Object.values(permissionCategory)) {
            await Permission.findOrCreate({ where: { 
                name: permission.name, 
                description: permission.description,
                is_user_defined: false
            } });
        }        
    }
    
    for (const role of Object.values(ROLES)) {
        await Role.findOrCreate({ where: { 
            name: role.name, 
            description: role.description,
            is_user_defined: false
        } });

        for (const permissionName of role.permissions) {
            if (permissionName === '*') {
                const all = await Permission.findAll();
                for (const permission of all) {
                    await RolePermission.findOrCreate({ where: { 
                        role_name: role.name, 
                        permission_name: permission.name 
                    } });
                }

                continue;
            }

            const permission = await Permission.findOne({ where: { name: permissionName } });
            await RolePermission.findOrCreate({ where: { 
                role_name: role.name, 
                permission_name: permission.name 
            } });
        }
    }

    await (async () => {
        const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
        await User.findOrCreate({ where: { email, password, role_name: ROLES.ADMIN.name } });
    })();

    await (async () => {
        const email = 'userAdmin@example.com';
        const password = '126345678';
        await User.findOrCreate({ where: { email, password, role_name: ROLES.USER_ADMIN.name } });
    })();

    await (async () => {
        const email = 'member@example.com';
        const password = 'SuperSecretPassword';
        await User.findOrCreate({ where: { email, password, role_name: ROLES.MEMBER.name } });
    })();

    await (async () => {
        const email = 'productManager@example.com';
        const password = '126345678';
        await User.findOrCreate({ where: { email, password, role_name: ROLES.PRODUCT_MANAGER.name } });
    })();

    await (async () => {
        const email = 'productEmployee@example.com';
        const password = '126345678';
        await User.findOrCreate({ where: { email, password, role_name: ROLES.PRODUCT_EMPLOYEE.name } });
    })();
})();
