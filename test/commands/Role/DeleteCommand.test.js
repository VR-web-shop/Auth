import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import DeleteCommand from '../../../src/commands/Role/DeleteCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('DeleteCommand should soft delete a role', async () => {
    await commandService.invoke(new DeleteCommand('m1m-hhh-iii'));
    const role = await testDB.db.Role.findOne({ where: { client_side_uuid: 'm1m-hhh-iii' } });
    const removed = await testDB.db.RoleRemoved.findOne({ where: { role_client_side_uuid: 'm1m-hhh-iii' } });

    expect(removed).toBeDefined();
    expect(removed.deleted_at).toBeDefined();
    expect(removed.deleted_at).not.toBeNull();
    expect(removed.role_client_side_uuid).toBe('m1m-hhh-iii');
    expect(role).toBeDefined();
    expect(role.client_side_uuid).toBe('m1m-hhh-iii');
});

test('DeleteCommand should throw an error if the role is defined by the system', async () => {
  expect(async () => await commandService.invoke(new DeleteCommand('aaa-bbb-ccc')))
    .rejects
    .toThrowError('Role aaa-bbb-ccc is defined by the system and cannot be deleted');
});
