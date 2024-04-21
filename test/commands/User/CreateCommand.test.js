import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import CreateCommand from '../../../src/commands/User/CreateCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('CreateCommand should create a new user', async () => {
  const params = { email: 'test4@test.dk', password: '12345678', first_name: 'John4', last_name: 'Doe4', role_client_side_uuid: 'aaa-bbb-ccc' };
  await commandService.invoke(new CreateCommand('jjj-kkk-lll', params));
  const user = await testDB.db.User.findOne({ where: { client_side_uuid: 'jjj-kkk-lll' } });
  const desc = await testDB.db.UserDescription.findOne({ where: { user_client_side_uuid: 'jjj-kkk-lll' } })

  expect(user.client_side_uuid).toBe('jjj-kkk-lll')
  expect(desc.first_name).toBe('John4')
  expect(desc.last_name).toBe('Doe4')
  expect(desc.email).toBe('test4@test.dk')
  expect(desc.active_email).toBe('test4@test.dk')
  expect(desc.role_client_side_uuid).toBe('aaa-bbb-ccc')
  expect(desc.password).toBeDefined()
  expect(desc.password).not.toBe('12345678')
});

test('CreateCommand should throw an error if a user with client side uuid already exist', async () => {
  const params = { email: 'another_email@test.dk', password: '12345678', first_name: 'John4', last_name: 'Doe4', role_client_side_uuid: 'aaa-bbb-ccc' };
  const cmd = new CreateCommand('jjj-kkk-lll', params);
  expect(async () => await commandService.invoke(cmd)).rejects.toThrowError("Entity with client_side_uuid jjj-kkk-lll already exists");
});

test('CreateCommand should throw an error if a user exist with an active email matching the email from the request', async () => {
  const params = { email: 'test4@test.dk', password: '12345678', first_name: 'John4', last_name: 'Doe4', role_client_side_uuid: 'aaa-bbb-ccc' };
  const cmd = new CreateCommand('mmm-nnn-ooo', params);
  expect(async () => await commandService.invoke(cmd)).rejects.toThrowError("The following fields must be unique: active_email");
});
