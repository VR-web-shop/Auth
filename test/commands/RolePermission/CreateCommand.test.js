import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import CreateCommand from '../../../src/commands/RolePermission/CreateCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('CreateCommand should create a new role permission', async () => {
    const params = { permission_name: 'users:delete', role_client_side_uuid: 'aaa-bbb-ccc' };
    await commandService.invoke(new CreateCommand('jjj-kkk-lll', params));
    const rolePermission = await testDB.db.RolePermission.findOne({ where: { client_side_uuid: 'jjj-kkk-lll' } });

    expect(rolePermission.client_side_uuid).toBe('jjj-kkk-lll')
    expect(rolePermission.permission_name).toBe('users:delete')
    expect(rolePermission.role_client_side_uuid).toBe('aaa-bbb-ccc')   
});

test('CreateCommand should throw an error if a role permission if client_side_uuid already exist', async () => {
  const params = { permission_name: 'users:delete', role_client_side_uuid: 'aaa-bbb-ccc' };
  const cmd = new CreateCommand('jjj-kkk-lll', params);
  expect(async () => await commandService.invoke(cmd)).rejects.toThrowError();
});
