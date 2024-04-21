import { expect, test, beforeAll } from 'vitest'
import db from '../../../db/models/index.cjs';
import permission from '../../../db/models/permission.cjs';
import permissiondescription from '../../../db/models/permissiondescription.cjs';
import permissionremoved from '../../../db/models/permissionremoved.cjs';

import DeleteCommand from '../../../src/commands/Permission/DeleteCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, 
    PermissionModel, 
    PermissionDescriptionModel, 
    PermissionRemovedModel;

beforeAll(async () => {
  commandService = new ModelCommandService();
  
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setDate(new Date().getDate() - 1);
  const twoDaysAgo = new Date().setDate(new Date().getDate() - 2);

  PermissionModel = permission(db.sequelize, db.Sequelize.DataTypes);
  await PermissionModel.sync({ force: true });
  await PermissionModel.bulkCreate([
    { name: 'users:delete' },
    { name: 'users:put' },
    { name: 'users:create' }
  ]);

  PermissionDescriptionModel = permissiondescription(db.sequelize, db.Sequelize.DataTypes);
  await PermissionDescriptionModel.sync({ force: true });
  await PermissionDescriptionModel.bulkCreate([
    { id: 1, permission_name: 'users:delete', description: 'aaa', created_at: twoDaysAgo, updated_at: twoDaysAgo },
    { id: 2, permission_name: 'users:delete', description: 'bbb', created_at: yesterday, updated_at: yesterday },
    { id: 3, permission_name: 'users:delete', description: 'ccc', created_at: today, updated_at: today }
  ]);

  PermissionRemovedModel = permissionremoved(db.sequelize, db.Sequelize.DataTypes);
  await PermissionRemovedModel.sync({ force: true });
  await PermissionRemovedModel.bulkCreate([
    { id: 1, permission_name: 'users:put', deleted_at: new Date(), created_at: twoDaysAgo, updated_at: twoDaysAgo },
    { id: 2, permission_name: 'users:create', deleted_at: new Date(), created_at: yesterday, updated_at: yesterday }
  ]);
});

test('DeleteCommand should soft delete a permission', async () => {
    await commandService.invoke(new DeleteCommand('users:delete'));
    const permission = await PermissionModel.findOne({ where: { name: 'users:delete' } });
    const removed = await PermissionRemovedModel.findOne({ where: { permission_name: 'users:delete' } });

    expect(removed).toBeDefined();
    expect(removed.deleted_at).toBeDefined();
    expect(removed.deleted_at).not.toBeNull();
    expect(removed.permission_name).toBe('users:delete');
    expect(permission).toBeDefined();
    expect(permission.name).toBe('users:delete');
});
