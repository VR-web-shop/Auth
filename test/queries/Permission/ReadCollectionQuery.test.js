import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadCollectionQuery from '../../../src/queries/Permission/ReadCollectionQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService;

beforeAll(async () => {
  queryService = new ModelQueryService();
  await db_test();
});

test('ReadCollectionQuery should read all roles', async () => {
    const { rows, count } = await queryService.invoke(new ReadCollectionQuery());
    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe('users:delete');
    expect(count).toBe(2);
});

test('ReadCollectionQuery should be able to paginate roles if page and limit is provided', async () => {
  const { rows, pages, count } = await queryService.invoke(new ReadCollectionQuery({ page: 1, limit: 10 }));

  expect(rows).toHaveLength(2);
  expect(rows[0].name).toBe('users:delete');
  expect(pages).toBe(1);
  expect(count).toBe(2);
});
