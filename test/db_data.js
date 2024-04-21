import bcrypt from 'bcrypt';

const today = new Date().setHours(0, 0, 0, 0);
const yesterday = new Date().setDate(new Date().getDate() - 1);
const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);
const password = await bcrypt.hash('12345678', 10);

export default {
    permissions: [
        { name: 'users:delete', defined_by_system: true },
        { name: 'users:put', defined_by_system: true },
        { name: 'users:create', defined_by_system: true },
        { name: 'custom:permission', defined_by_system: false }
    ],
    permissionDescriptions: [
        {
            id: 1,
            permission_name: 'users:delete',
            description: 'aaa',
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 2,
            permission_name: 'users:delete',
            description: 'bbb',
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            id: 3,
            permission_name: 'users:delete',
            description: 'ccc',
            created_at: today,
            updated_at: today
        },
        {
            id: 4,
            permission_name: 'users:put',
            description: 'ddd',
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 5,
            permission_name: 'users:create',
            description: 'eee',
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            id: 6,
            permission_name: 'custom:permission',
            description: 'eee',
            created_at: yesterday,
            updated_at: yesterday
        }
    ],
    permissionRemoved: [
        {
            id: 1,
            permission_name: 'users:put',
            deleted_at: new Date(),
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 2,
            permission_name: 'users:create',
            deleted_at: new Date(),
            created_at: yesterday,
            updated_at: yesterday
        }
    ],

    roles: [
        { client_side_uuid: 'aaa-bbb-ccc', defined_by_system: true },
        { client_side_uuid: 'ddd-eee-fff', defined_by_system: true },
        { client_side_uuid: 'ggg-hhh-iii', defined_by_system: true },
        { client_side_uuid: 'm1m-hhh-iii', defined_by_system: false }
    ],
    roleDescriptions: [
        {
            role_client_side_uuid: 'aaa-bbb-ccc',
            name: 'admin',
            description: 'Administrator',
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            role_client_side_uuid: 'aaa-bbb-ccc',
            name: 'admin2',
            description: 'Administrator2',
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            role_client_side_uuid: 'aaa-bbb-ccc',
            name: 'admin3',
            description: 'Administrator3',
            created_at: today,
            updated_at: today
        },
        {
            role_client_side_uuid: 'ddd-eee-fff',
            name: 'user',
            description: 'User',
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            role_client_side_uuid: 'ggg-hhh-iii',
            name: 'guest',
            description: 'Guest',
            created_at: today,
            updated_at: today
        },
        {
            role_client_side_uuid: 'm1m-hhh-iii',
            name: 'custom Role',
            description: 'custom Role',
            created_at: today,
            updated_at: today
        }
    ],
    roleRemoved: [
        {
            id: 1,
            role_client_side_uuid: 'ddd-eee-fff',
            deleted_at: new Date(),
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 2,
            role_client_side_uuid: 'ggg-hhh-iii',
            deleted_at: new Date(),
            created_at: yesterday,
            updated_at: yesterday
        }
    ],

    rolePermissions: [
        {
            client_side_uuid: 'aaa-bbb-ccc',
            role_client_side_uuid: 'aaa-bbb-ccc',
            permission_name: 'users:delete',
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            client_side_uuid: 'ddd-eee-fff',
            role_client_side_uuid: 'aaa-bbb-ccc',
            permission_name: 'users:create',
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            client_side_uuid: 'ggg-hhh-iii',
            role_client_side_uuid: 'aaa-bbb-ccc',
            permission_name: 'users:put',
            created_at: today,
            updated_at: today
        }
    ],
    rolePermissionRemoved: [
        {
            id: 1,
            role_permission_client_side_uuid: 'ddd-eee-fff',
            deleted_at: new Date(),
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 2,
            role_permission_client_side_uuid: 'ggg-hhh-iii',
            deleted_at: new Date(),
            created_at: yesterday,
            updated_at: yesterday
        }
    ],

    users: [
        { client_side_uuid: 'aaa-bbb-ccc' },
        { client_side_uuid: 'ddd-eee-fff' },
        { client_side_uuid: 'ggg-hhh-iii' },
        { client_side_uuid: 'aaa-bbb-ccc2' }
    ],
    userDescriptions: [
        {
            id: 1,
            user_client_side_uuid: 'aaa-bbb-ccc',
            role_client_side_uuid: 'aaa-bbb-ccc',
            first_name: 'John',
            last_name: 'Doe',
            active_email: null,
            email: 'test@test.dk',
            password,
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 2,
            user_client_side_uuid: 'aaa-bbb-ccc',
            role_client_side_uuid: 'aaa-bbb-ccc',
            first_name: 'John2',
            last_name: 'Doe2',
            active_email: null,
            email: 'test2@test.dk',
            password,
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            id: 3,
            user_client_side_uuid: 'aaa-bbb-ccc',
            role_client_side_uuid: 'aaa-bbb-ccc',
            first_name: 'John3',
            last_name: 'Doe3',
            active_email: 'test3@test.dk',
            email: 'test3@test.dk',
            password,
            created_at: today,
            updated_at: today
        },
        {
            id: 4,
            user_client_side_uuid: 'ddd-eee-fff',
            role_client_side_uuid: 'aaa-bbb-ccc',
            first_name: 'John4',
            last_name: 'Doe4',
            active_email: 'testtest@test.dk',
            email: 'testtest@test.dk',
            password,
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 5,
            user_client_side_uuid: 'ggg-hhh-iii',
            role_client_side_uuid: 'aaa-bbb-ccc',
            first_name: 'John5',
            last_name: 'Doe5',
            active_email: 'testtest2@test.dk',
            email: 'testtest2@test.dk',
            password,
            created_at: yesterday,
            updated_at: yesterday
        },
        {
            id: 6,
            user_client_side_uuid: 'aaa-bbb-ccc2',
            role_client_side_uuid: 'aaa-bbb-ccc',
            first_name: 'John6',
            last_name: 'Doe6',
            active_email: 'testtest3@test.dk',
            email: 'testtest3@test.dk',
            password,
            created_at: today,
            updated_at: today
        }
    ],
    userRemoved: [
        {
            id: 1,
            user_client_side_uuid: 'ddd-eee-fff',
            deleted_at: new Date(),
            created_at: twoDaysAgo,
            updated_at: twoDaysAgo
        },
        {
            id: 2,
            user_client_side_uuid: 'ggg-hhh-iii',
            deleted_at: new Date(),
            created_at: yesterday,
            updated_at: yesterday
        }
    ]
}
