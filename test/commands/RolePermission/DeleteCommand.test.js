import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import DeleteCommand from '../../../src/commands/RolePermission/DeleteCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('DeleteCommand should soft delete a role permission', async () => {
    await commandService.invoke(new DeleteCommand('aaa-bbb-ccc'));
    const rolePermission = await testDB.db.RolePermission.findOne({ where: { client_side_uuid: 'aaa-bbb-ccc' } });
    const removed = await testDB.db.RolePermissionRemoved.findOne({ where: { role_permission_client_side_uuid: 'aaa-bbb-ccc' } });

    expect(removed).toBeDefined();
    expect(removed.deleted_at).toBeDefined();
    expect(removed.deleted_at).not.toBeNull();
    expect(removed.role_permission_client_side_uuid).toBe('aaa-bbb-ccc');
    expect(rolePermission).toBeDefined();
    expect(rolePermission.client_side_uuid).toBe('aaa-bbb-ccc');
});
