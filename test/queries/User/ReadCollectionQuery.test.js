import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadCollectionQuery from '../../../src/queries/User/ReadCollectionQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService;

beforeAll(async () => {
  queryService = new ModelQueryService();
  await db_test();
});

test('ReadCollectionQuery should read all users', async () => {
    const { rows, pages, count} = await queryService.invoke(new ReadCollectionQuery());
    console.log(rows);
    expect(rows).toHaveLength(2);
    expect(rows[0].client_side_uuid).toBe('aaa-bbb-ccc');
    expect(rows[1].client_side_uuid).toBe('aaa-bbb-ccc2');
    expect(pages).toBe(1);
    expect(count).toBe(2);
});
