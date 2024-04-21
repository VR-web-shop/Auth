import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/Role/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('PutCommand should create a role', async () => {
    const client_side_uuid = 'jjj-kkk-lll';
    const params = { name: 'admin', description: 'Administrator' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const role = await testDB.db.Role.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.RoleDescription.findOne({ where: { role_client_side_uuid: client_side_uuid }})

    expect(role.client_side_uuid).toBe(client_side_uuid)
    expect(desc.role_client_side_uuid).toBe(client_side_uuid)
    expect(desc.name).toBe('admin')
    expect(desc.description).toBe('Administrator')
});

test('PutCommand should update a role if it exist', async () => {
    const client_side_uuid = 'jjj-kkk-lll';
    const params = { name: 'admin2', description: 'Administrator2' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const role = await testDB.db.Role.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.RoleDescription.findOne({ 
        where: { role_client_side_uuid: client_side_uuid },
        order: [["created_at", "DESC"]] 
    })

    expect(role.client_side_uuid).toBe(client_side_uuid)
    expect(desc.role_client_side_uuid).toBe(client_side_uuid)
    expect(desc.name).toBe('admin2')
    expect(desc.description).toBe('Administrator2')
})
