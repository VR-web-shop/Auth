import { expect, test, beforeAll } from 'vitest'
import db_test from '../db_test.js';
import AuthService from '../../src/services/AuthService.js';

beforeAll(async () => {
  await db_test();
});

test('AuthService.create should return an access and refresh token if a valid email and password is provided', async () => {
    const { access_token, refresh_token } = await AuthService.create('test3@test.dk', '12345678');

    expect(access_token).toBeDefined();
    expect(refresh_token).toBeDefined();
});

test('AuthService.create should throw an error if an invalid email is provided', async () => {
    expect(async () => await AuthService.create(null, '12345678')).rejects.toThrow("Email must be a string");
});

test('AuthService.create should throw an error if an invalid password is provided', async () => {
    expect(async () => await AuthService.create('test@test.dk', null)).rejects.toThrow("Password must be a string");
});

test('AuthService.create should throw an error if the password is wrong', async () => {
    expect(async () => await AuthService.create('test3@test.dk', 'wrong-password')).rejects.toThrow("Incorect password");
});