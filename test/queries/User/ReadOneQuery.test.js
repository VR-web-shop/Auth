import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/User/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a user', async () => {
  const data = db.data.users[0];
  const user = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

  expect(user.client_side_uuid).toBe(data.client_side_uuid);
  expect(user.first_name).toBe('John3');
  expect(user.last_name).toBe('Doe3');
  expect(user.email).toBe('test3@test.dk');
  expect(user.role_client_side_uuid).toBe('aaa-bbb-ccc');
});

test('ReadOneQuery should throw an error if user does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if user does exist but has a tombstone', async () => {
  const data = db.data.users[1];
  const cmd = new ReadOneQuery(data.client_side_uuid);
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

