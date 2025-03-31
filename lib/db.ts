'use server';

import { getPostgresClient } from '@/config/postgres';
import { User } from 'next-auth';

export async function createUser(user: User) {
  const pg = await getPostgresClient();

  const result = await pg.query(`SELECT * FROM users WHERE email = $1`, {
    params: [user.email]
  });

  if (result.rows && result.rows.length > 0 && result.fields) {
    const scopeIndex = result.fields.findIndex((field) => field.fieldName === 'scope');
    if (scopeIndex !== -1) {
      const scope = result.rows[0][scopeIndex];

      if (scope === null) {
        await pg.query(`UPDATE users SET scope = $1 WHERE username = $2`, {
          params: [user.scope?.includes('repo') ? 'extended' : 'basic', user.username]
        });
      }
    }
  }

  if (result.rows && result.rows.length > 0) {
    return { message: 'User already exists' };
  }

  await pg.query(
    `INSERT INTO users (name, email, image, username, subscribed) VALUES ($1, $2, $3, $4, $5)`,
    { params: [user.name, user.email, user.image, user.username, false] }
  );

  return { message: 'User created' };
}
