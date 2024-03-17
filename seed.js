import 'dotenv/config'
import Database from './src/models/Database.js';

import Role, { ROLES } from './src/models/Role.js';
import User from './src/models/User.js';

(async () => {
    try {
        await Database.sync({ force: true });
    } catch (error) {
        console.log('Error syncing database: ', error);
    }

    for (const role of Object.values(ROLES)) {
        await Role.findOrCreate({ where: { name: role } });
    }

    await (async () => {
        const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
        await User.findOrCreate({ where: { email, password, role_name: ROLES.ADMIN } });
    })();

    await (async () => {
        const email = 'member@example.com';
        const password = 'SuperSecretPassword';
        await User.findOrCreate({ where: { email, password, role_name: ROLES.MEMBER } });
    })();
})();
