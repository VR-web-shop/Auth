import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/Permission/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});


test('PutCommand should create a permission', async () => {
    const name = 'users:update';
    const params = { description: 'ddd' }
    await commandService.invoke(new PutCommand(name, params));
    const permission = await testDB.db.Permission.findOne({ where: { name }})
    const desc = await testDB.db.PermissionDescription.findOne({ where: { permission_name: name }})

    expect(permission.name).toBe(name)
    expect(desc.permission_name).toBe('users:update')
    expect(desc.description).toBe('ddd')
});

test('PutCommand should update a permission if it exist', async () => {
    const name = 'users:update';
    const params = { description: 'eee' }
    await commandService.invoke(new PutCommand(name, params));
    const permission = await testDB.db.Permission.findOne({ where: { name }})
    const desc = await testDB.db.PermissionDescription.findOne({ 
        where: { permission_name: name }, 
        order: [["created_at", "DESC"]]
    })

    expect(permission.name).toBe(name)
    expect(desc.permission_name).toBe('users:update')
    expect(desc.description).toBe('eee')
})
