import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/User/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('PutCommand should create a user', async () => {
    const client_side_uuid = 'jjj-kkk-lll';
    const params = { role_client_side_uuid: 'aaa-bbb-ccc', first_name: 'John4', last_name: 'Doe4', email: 'ddd@test.dk', password: '12345678' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const user = await testDB.db.User.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.UserDescription.findOne({ where: { user_client_side_uuid: client_side_uuid }})

    expect(user.client_side_uuid).toBe(client_side_uuid)
    expect(desc.role_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.first_name).toBe('John4')
    expect(desc.last_name).toBe('Doe4')
    expect(desc.email).toBe('ddd@test.dk')
    expect(desc.active_email).toBe('ddd@test.dk')
    expect(desc.password).toBeDefined()
    expect(desc.password).not.toBe('12345678')
});

test('PutCommand should update a user if it exist', async () => {
    const client_side_uuid = 'jjj-kkk-lll';
    const params = { role_client_side_uuid: 'aaa-bbb-ccc', first_name: 'John5', last_name: 'Doe5', email: 'eee@test.dk', password: '12345678' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const user = await testDB.db.User.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.UserDescription.findAll({ 
        where: { user_client_side_uuid: client_side_uuid }, 
        order: [["created_at", "DESC"]]
    })

    const activeDesc = desc[0]
    const oldDesc = desc[1]
    
    expect(user.client_side_uuid).toBe(client_side_uuid)
    expect(activeDesc.role_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(activeDesc.first_name).toBe('John5')
    expect(activeDesc.last_name).toBe('Doe5')
    expect(activeDesc.email).toBe('eee@test.dk')
    expect(activeDesc.active_email).toBe('eee@test.dk')
    expect(activeDesc.password).toBeDefined()
    expect(activeDesc.password).not.toBe('12345678')

    expect(oldDesc.email).toBe('ddd@test.dk')
    expect(oldDesc.active_email).toBeNull()
})

test('PutCommand should NOT throw an error if the email in the request is already in use by a user with SAME client side uuid', async () => {
    const client_side_uuid = 'jjj-kkk-lll';
    const params = { role_client_side_uuid: 'aaa-bbb-ccc', first_name: 'John5', last_name: 'Doe5', email: 'eee@test.dk', password: '12345678' }
    await commandService.invoke(new PutCommand(client_side_uuid, params))
    const user = await testDB.db.User.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.UserDescription.findAll({ 
        where: { user_client_side_uuid: client_side_uuid }, 
        order: [["created_at", "DESC"]]
    })

    const activeDesc = desc[0]
    const lastDesc = desc[1]
    const firstDesc = desc[2]

    expect(user.client_side_uuid).toBe(client_side_uuid)
    expect(activeDesc.role_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(activeDesc.first_name).toBe('John5')
    expect(activeDesc.last_name).toBe('Doe5')
    expect(activeDesc.password).toBeDefined()
    expect(activeDesc.password).not.toBe('12345678')

    // Note: First and last desc should have the same e-mail
    // since we didn't change the e-mail in the last PUT.
    // But only the active desc should have the active_email set.
    expect(activeDesc.email).toBe('eee@test.dk')
    expect(activeDesc.active_email).toBe('eee@test.dk')

    expect(lastDesc.email).toBe('eee@test.dk')
    expect(lastDesc.active_email).toBeNull()

    expect(firstDesc.email).toBe('ddd@test.dk')
    expect(firstDesc.active_email).toBeNull()
})

test('PutCommand should throw an error if the email in the request is already in use by a user with another client side uuid', async () => {
    const client_side_uuid = 'xxx-yyy-zzz';
    const params = { role_client_side_uuid: 'aaa-bbb-ccc', first_name: 'John5', last_name: 'Doe5', email: 'eee@test.dk', password: '12345678' }
    expect(async () => await commandService.invoke(new PutCommand(client_side_uuid, params)))
        .rejects.toThrowError("The following fields must be unique: active_email")
})
