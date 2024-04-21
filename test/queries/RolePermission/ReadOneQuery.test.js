import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/RolePermission/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a role permission', async () => {
    const data = db.data.rolePermissions[0];
    const rolePermission = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

    expect(rolePermission.client_side_uuid).toBe(data.client_side_uuid);
    expect(rolePermission.role_client_side_uuid).toBe('aaa-bbb-ccc');
    expect(rolePermission.permission_name).toBe('users:delete');
});

test('ReadOneQuery should throw an error if role permission does not exist', async () => {
    const cmd = new ReadOneQuery('not-a-real-permission');
    expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if role permission does exist but has a tombstone', async () => {
    const data = db.data.rolePermissions[1];
    const cmd = new ReadOneQuery(data.client_side_uuid);
    expect(queryService.invoke(cmd)).rejects.toThrowError();
})
