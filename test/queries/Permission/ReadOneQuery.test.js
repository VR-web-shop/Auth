import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/Permission/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a permission', async () => {
    const data = db.data.permissions[0];
    const permission = await queryService.invoke(new ReadOneQuery(data.name));

    expect(permission.name).toBe('users:delete');
    expect(permission.description).toBe('ccc');
});

test('ReadOneQuery should throw an error if permission does not exist', async () => {
    const cmd = new ReadOneQuery('zzz-yyy-xxx');
    expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if permission does exist but has a tombstone', async () => {
    const data = db.data.permissions[1];
    const cmd = new ReadOneQuery(data.name);
    expect(queryService.invoke(cmd)).rejects.toThrowError();
})
