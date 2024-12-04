import {createUsersTable} from '../api/GraphUserService';

export async function Init() {
  console.log('creating users');
  await createUsersTable();
}
