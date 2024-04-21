import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/Role/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a role', async () => {
    const data = db.data.roles[0];
    const role = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

    expect(role.client_side_uuid).toBe(data.client_side_uuid);
    expect(role.name).toBe('admin3');
    expect(role.description).toBe('Administrator3');
});

test('ReadOneQuery should throw an error if role does not exist', async () => {
    const cmd = new ReadOneQuery('zzz-yyy-xxx');
    expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if role does exist but has a tombstone', async () => {
    const data = db.data.roles[1];
    const cmd = new ReadOneQuery(data.client_side_uuid);
    expect(queryService.invoke(cmd)).rejects.toThrowError();
})
