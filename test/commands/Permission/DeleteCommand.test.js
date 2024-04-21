import { expect, test, beforeAll } from 'vitest';
import db_test from '../../db_test.js';

import DeleteCommand from '../../../src/commands/Permission/DeleteCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('DeleteCommand should soft delete a permission', async () => {
    await commandService.invoke(new DeleteCommand('custom:permission'));
    const permission = await testDB.db.Permission.findOne({ where: { name: 'custom:permission' } });
    const removed = await testDB.db.PermissionRemoved.findOne({ where: { permission_name: 'custom:permission' } });

    expect(removed).toBeDefined();
    expect(removed.deleted_at).toBeDefined();
    expect(removed.deleted_at).not.toBeNull();
    expect(removed.permission_name).toBe('custom:permission');
    expect(permission).toBeDefined();
    expect(permission.name).toBe('custom:permission');
});

test('DeleteCommand should throw an error if the permission is defined by the system', async () => {
    expect(async () => await commandService.invoke(new DeleteCommand('users:delete')))
      .rejects
      .toThrowError('Permission users:delete is defined by the system and cannot be deleted');
});
