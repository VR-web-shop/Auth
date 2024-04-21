import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import DeleteCommand from '../../../src/commands/User/DeleteCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('DeleteCommand should soft delete a user', async () => {
    await commandService.invoke(new DeleteCommand('aaa-bbb-ccc'));
    const user = await testDB.db.User.findOne({ where: { client_side_uuid: 'aaa-bbb-ccc' } });
    const removed = await testDB.db.UserRemoved.findOne({ where: { user_client_side_uuid: 'aaa-bbb-ccc' } });

    expect(removed).toBeDefined();
    expect(removed.deleted_at).toBeDefined();
    expect(removed.deleted_at).not.toBeNull();
    expect(removed.user_client_side_uuid).toBe('aaa-bbb-ccc');
    expect(user).toBeDefined();
    expect(user.client_side_uuid).toBe('aaa-bbb-ccc');
});
