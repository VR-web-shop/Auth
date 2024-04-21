import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ProtectedPutCommand from '../../../src/commands/User/ProtectedPutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('ProtectedPutCommand should create a user if params.verifyPassword is correct', async () => {
    const client_side_uuid = 'lll-bbb-ccc';
    const params = { role_client_side_uuid: 'aaa-bbb-ccc', verifyPassword: '12345678', first_name: 'John4', last_name: 'Doe4', email: 'ddd@test.dk', password: '12345678' }
    await commandService.invoke(new ProtectedPutCommand(client_side_uuid, params));
    const user = await testDB.db.User.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.UserDescription.findOne({ 
      where: { user_client_side_uuid: client_side_uuid },
      order: [["created_at", "DESC"]]
    })

    expect(user.client_side_uuid).toBe(client_side_uuid)
    expect(desc.role_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.first_name).toBe('John4')
    expect(desc.last_name).toBe('Doe4')
    expect(desc.email).toBe('ddd@test.dk')
    expect(desc.active_email).toBe('ddd@test.dk')
    expect(desc.password).toBeDefined()
    expect(desc.password).not.toBe('12345678')
});

test('ProtectedPutCommand should update a user if params.verifyPassword is correct', async () => {
  const client_side_uuid = 'lll-bbb-ccc';
  const params = { role_client_side_uuid: 'aaa-bbb-ccc', verifyPassword: '12345678', first_name: 'John5', last_name: 'Doe5', email: 'ddd5@test.dk', password: '12345678' }
  await commandService.invoke(new ProtectedPutCommand(client_side_uuid, params));
  const user = await testDB.db.User.findOne({ where: { client_side_uuid }})
  const desc = await testDB.db.UserDescription.findOne({ 
    where: { user_client_side_uuid: client_side_uuid },
    order: [["created_at", "DESC"]]
  })

  expect(user.client_side_uuid).toBe(client_side_uuid)
  expect(desc.role_client_side_uuid).toBe('aaa-bbb-ccc')
  expect(desc.first_name).toBe('John5')
  expect(desc.last_name).toBe('Doe5')
  expect(desc.email).toBe('ddd5@test.dk')
  expect(desc.active_email).toBe('ddd5@test.dk')
  expect(desc.password).toBeDefined()
  expect(desc.password).not.toBe('12345678')
});

test('ProtectedPutCommand should throw an error if params.verifyPassword is incorrect', async () => {
  const client_side_uuid = 'lll-bbb-ccc';
  const params = { role_client_side_uuid: 'aaa-bbb-ccc', verifyPassword: 'not-correct', first_name: 'John5', last_name: 'Doe5', email: 'ddd5@test.dk', password: '12345678' }
  const cmd = new ProtectedPutCommand(client_side_uuid, params)
  expect(async () => await commandService.invoke(cmd)).rejects.toThrowError("Invalid password");
});
